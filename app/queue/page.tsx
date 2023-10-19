"use client";
import ArticleList from "@/components/ArticleList";
import {
  Button,
  Card,
  Container,
  Flex,
  FormLabel,
  GridItem,
  Heading,
  Radio,
  Spinner,
} from "@chakra-ui/react";
import {
  useAddress,
  useContract,
  useMetadata,
  useNFTBalance,
} from "@thirdweb-dev/react";
import React, { useEffect, useMemo, useState } from "react";
import { AddressZero } from "@ethersproject/constants";

interface Vote {
  type: number;
  label: string;
}
interface ArticleListProps {
  // Define `vote` prop to have the type of your contract
  vote: any; // Ideally, you should replace `any` with the correct contract type
}

interface Proposal {
  proposalId: any;
  description: string;
  votes: Vote[];
}

export default function Queue() {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  //console.log("👋 Address:", address);

  // Initialize our Edition Drop contract
  const editionDropAddress = "0x7f2BfBf0E6904b5B6Facec197C64b8eB4b1aBeC1";
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { contract: vote } = useContract(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS,
    "vote"
  );
  if (vote === undefined) {
    console.log("vote is undefined");
  }

  const { contract: token } = useContract(
    "0x3Aa1FebD87D6Cf9bAB16475f943b39DbFbf18f33",
    "token"
  );

  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  const { data: metadata, isLoading: isLoadingMetadata } =
    useMetadata(editionDrop);

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  const [selectedVotes, setSelectedVotes] = useState<{
    [proposalId: string]: number;
  }>({});
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedProposals, setVotedProposals] = useState<string[]>([]);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        if (vote?.getAll) {
          const proposals = await vote.getAll();
          setProposals(proposals);
          console.log("🌈 Proposals:", proposals);
        } else {
          console.log("getAll method is not available on vote contract");
        }
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  useEffect(() => {
    // this useEffect was missing its closing bracket
    const checkIfUserHasVoted = async () => {
      try {
        if (vote?.hasVoted) {
          const hasVoted = await vote.hasVoted(
            proposals[0]?.proposalId, // Also, make sure proposals[0] is not undefined
            address
          );
          setHasVoted(hasVoted);
          if (hasVoted) {
            console.log("🥵 User has already voted");
          } else {
            console.log("🙂 User has not voted yet");
          }
        } else {
          console.log("hasVoted method is not available on vote contract");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };

    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);
  // Render the screen where the user can claim their NFT.
  // If the user has already claimed their NFT we want to display the internal DAO page to them
  // only DAO members will see this. Render all the members + token amounts.
  if (hasClaimedNFT) {
    return (
      <>
        <Container padding={16} maxWidth={1240} className="member-page">
          <GridItem gap={4}>
            <Heading fontSize={20}>Active Proposals</Heading>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                if (!(token?.getDelegationOf && token?.delegateTo)) {
                  console.log(
                    "getDelegationOf or delegateTo method is not available on token contract"
                  );
                  setIsVoting(false);
                  return;
                }

                if (
                  !(
                    typeof vote?.get === "function" &&
                    typeof vote?.vote === "function" &&
                    typeof vote?.execute === "function"
                  )
                ) {
                  console.log(
                    "get, vote or execute method is not available on vote contract"
                  );
                  setIsVoting(false);
                  return;
                }

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal: any) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote: any) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    ) as HTMLInputElement;

                    if (elem && elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(
                    address as any
                  );
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address as any);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }

                        // after successful vote execution
                        setVotedProposals((prevProposals) => [
                          ...prevProposals,
                          proposalId,
                        ]);

                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens", err);
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              <Button disabled={isVoting || hasVoted} type="submit">
                {isVoting ? (
                  <Spinner />
                ) : hasVoted ? (
                  "You Already Voted"
                ) : (
                  "Submit Votes"
                )}
              </Button>

              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
              {proposals.map((proposal: any) => (
                <Card
                  padding={6}
                  borderRadius={20}
                  key={proposal.proposalId}
                  className="card"
                  style={
                    votedProposals.includes(proposal.proposalId)
                      ? { opacity: 0.5 }
                      : {}
                  }
                >
                  <Heading fontSize={16}>{proposal.description}</Heading>
                  <div>
                    {proposal.votes.map(({ type, label }: any) => (
                      <Flex key={type}>
                        <Radio
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          defaultChecked={type === 2}
                          disabled={votedProposals.includes(
                            proposal.proposalId
                          )}
                        />
                        <FormLabel htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </FormLabel>
                      </Flex>
                    ))}
                  </div>
                </Card>
              ))}
            </form>
          </GridItem>
        </Container>
      </>
    );
  }
}
