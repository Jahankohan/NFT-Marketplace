import "../styles/globals.css";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import Layout from "./components/layout";

const supportedChainIds = [1337];
const connectors = {
  injected: {},
};

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebWeb3Provider>
  );
}

export default MyApp;
