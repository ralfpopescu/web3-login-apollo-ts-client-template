import { useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useCookies } from "react-cookie";
import { InjectedConnector } from "@web3-react/injected-connector";
import * as ethers from "ethers";

const GET_NONCE = gql`
  query GetNonce {
    getNonce {
      nonce
      appSignedNonce
    }
  }
`;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      isNew
    }
  }
`;

export const Login = () => {
  const provider = useWeb3React<Web3Provider>();
  console.log({ provider });
  const { library, account } = provider;
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const nonceRequest = useQuery(GET_NONCE);
  const [login, loginRequest] = useMutation(LOGIN);

  useEffect(() => {
    if (loginRequest.data) {
      const { accessToken } = loginRequest.data;
      setCookie("token", accessToken);
    }
  }, [loginRequest, setCookie]);

  return cookies.token ? (
    <button
      onClick={async () => {
        console.log("lcik");
        if (!library) {
          await provider.activate(new InjectedConnector({}));
        }
        if (nonceRequest.data && library) {
          const { nonce, appSignedNonce } = nonceRequest.data.getNonce;
          const userSignedNonce = await library?.getSigner().signMessage(nonce);
          console.log({
            nonce,
            appSignedNonce,
            account,
            userSignedNonce,
            library,
            signer: library?.getSigner(),
          });
          login({
            variables: {
              input: { nonce, appSignedNonce, publicAddress: account, userSignedNonce },
            },
          });
        }
      }}
    >
      {library ? "login" : "connect"}
    </button>
  ) : (
    <button
      onClick={async () => {
        removeCookie("token");
      }}
    >
      login
    </button>
  );
};
