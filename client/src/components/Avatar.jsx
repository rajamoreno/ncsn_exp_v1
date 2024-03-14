import React from "react";

export function Avatar({ player }) {
  return (
    <img
      className="h-full w-full rounded-md shadow bg-white p-1"
      // src={`https://avatars.dicebear.com/api/identicon/${player.id}.svg`} // outdated API call syntax
      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${player.id}`}
      alt="Avatar"
    />
  );
}
