import imgURL from "../images/globe.png";

export default function Header() {
  return (
      <header>
          <img src={imgURL} />
          <h1>my travel journal.</h1>
      </header>
  )
}