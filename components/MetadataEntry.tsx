import React from "react";

export default function MetadataEntry({
  id,
  name,
  description,
  timestamp,
  address,
  image,
}: any) {
  const blob = new Blob([new Uint8Array(image.data)], { type: "image/jpeg" }); // adjust the MIME type if necessary
  const url = URL.createObjectURL(blob);
  return (
    <div className="metadata-entry">
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <p>Timestamp: {timestamp}</p>
      <p>Address: {address}</p>
      <img src={image} alt={name} />
    </div>
  );
}
