import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { CookiesProvider } from "react-cookie";
import { Web3Provider } from "@ethersproject/providers";
import { Login } from "./components/Login";
import { Web3ReactProvider } from "@web3-react/core";

const client = new ApolloClient({
  uri: "http://localhost:3002/graphql",
  cache: new InMemoryCache(),
});

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  return library;
}

function App() {
  return (
    <ApolloProvider client={client}>
      <CookiesProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <div className="App">
            <Login />
          </div>
        </Web3ReactProvider>
      </CookiesProvider>
    </ApolloProvider>
  );
}

export default App;
