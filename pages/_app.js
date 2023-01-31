import Head from "next/head";

import { Provider } from "react-redux";
import { useStore } from "../store";

// import NavBar from "../components/common/NavBarComponent";
// import Modal from "../components/common/ModalComponent";

// import auth from "../auth/Authenticator";

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Head>
        <script src="https://maps.googleapis.com/maps/api/js?v=quarterly&key=AIzaSyCx-skGzBQpfifpGsclSgQ0rlDng25ZdCg&libraries=geometry,drawing,places"></script>
      </Head>

      <Component {...pageProps} />
    </Provider>
  );
}
