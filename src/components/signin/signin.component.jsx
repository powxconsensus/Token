import React from "react";
import { authenticate } from "../../auth";

const Signin = () => {
  return (
    <div width="100%" textAlign="center">
      <div maxWidth="800px" mx="auto" mt={[6, "100px"]}>
        <text
          fontWeight="700"
          fontSize={["36px", "50px"]}
          lineHeight={1}
          display="block"
        >
          Todos secured by Stacks
        </text>
        <div mt={[5, "60px"]}>
          <button onClick={() => authenticate()}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
