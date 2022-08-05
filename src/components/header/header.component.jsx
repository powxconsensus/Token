import React from "react";
import { getPerson, getUserData, userSession } from "../../auth";
// import { Logo } from "./icons/logo";

const Auth = () => {
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  const Avatar = () => {
    const person = getPerson();

    if (person.avatarUrl()) {
      return (
        <div
          borderRadius="50%"
          width="24px"
          height="24px"
          display="inline-block"
          overflow="hidden"
          mr={2}
          style={{ position: "relative", top: "6px" }}
        >
          <div
            as="img"
            src={person.avatarUrl()}
            maxWidth="100%"
            minHeight="24px"
            minWidth="24px"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Avatar />
      <text fontWeight="500">{getUserData().username}</text>
      <text
        fontWeight="300"
        display="inline-block"
        ml={5}
        color="ink.400"
        cursor="pointer"
        onClick={() => {
          userSession.signUserOut();
          window.location = "/";
        }}
      >
        Sign out
      </text>
    </div>
  );
};

const Header = () => {
  return (
    <div width="100%" justifyContent="space-between" px={4} py={3}>
      <div
        alignItems
        onClick={() => (document.location = "/")}
        cursor="pointer"
      >
        {/* <Logo style={{ position: "relative", top: "-1px" }} /> */}
        <text ml={2} display="inline-block" fontWeight="600">
          Todos
        </text>
      </div>
      <Auth />
    </div>
  );
};

export default Header;
