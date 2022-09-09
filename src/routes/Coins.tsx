import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  font-weight: 500;
`;
const CoinsList = styled.ul``;
const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;

  a {
    padding: 20px;
    padding-top: 21px;
    transition: color 0.2s ease-in;
    display: flex;
    align-items: center;
    font-weight: 400;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;
export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 30px;
  left: 30px;
`;

export const NavigationIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.textColor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  padding-top: 2px;
  &:hover {
    cursor: pointer;
  }
  svg {
    font-size: 22px;
    background-color: inherit;
    color: ${(props) => props.theme.bgColor};
  }
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Coins = () => {
  //   const [coins, setCoins] = useState<CoinsInterface[]>([]);
  //   const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     (async () => {
  //       const response = await fetch("https://api.coinpaprika.com/v1/coins");
  //       const json = await response.json();
  //       setCoins(json.slice(0, 100));
  //       setLoading(false);
  //     })();
  //   }, []);

  const { isLoading, data } = useQuery<ICoin[]>(["allCoins"], fetchCoins);
  console.log(isLoading, data);
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <NavigationContainer>
        {isDark ? (
          <NavigationIcon onClick={toggleDarkAtom}>
            <Link to={"/"}>
              <FontAwesomeIcon icon={faSun} />
            </Link>
          </NavigationIcon>
        ) : (
          <NavigationIcon onClick={toggleDarkAtom}>
            <Link to={"/"}>
              <FontAwesomeIcon icon={faMoon} />
            </Link>
          </NavigationIcon>
        )}
      </NavigationContainer>
      <Header>
        <Title>Cryto Tracker</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
};
export default Coins;
