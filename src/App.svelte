<script>
  import { majorities, acts, pms } from "./data.js";
</script>

<style>
  main {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
    background: #fff;
    overflow: hidden;
  }

  header {
    height: 250vh;
  }

  header p {
    margin: 0;
    padding: 0;
    padding: 0 5vw;
    font-size: 1.4rem;
    color: #444;
    line-height: 2rem;
  }

  header p strong {
    border-bottom: 2px solid #333;
    padding-bottom: 1px;
  }

  h1 {
    background: url("/union-jack.jpg");
    background-size: cover;
    background-position: center center;
    text-transform: uppercase;
    font-size: 2.6rem;
    font-weight: 200;
    padding: 1.5rem 2rem;
    border-top: 2px solid #4c4c4c;
    border-bottom: 2px solid #4c4c4c;
    margin-left: -20px;
    margin-right: -20px;
  }
  h1,
  header p {
    transform: rotate(-2.2deg);
  }
  h1 div:first-child {
    font-size: 3rem;
    border-bottom: 2px solid #222;
    width: 380px;
    margin: 0 auto;
  }
  section.history {
    height: 200vh;
    background: #eee;
  }

  .cover {
    background: #b3b3b3;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cover-title {
    width: 100%;
    height: 66vh;
  }
</style>

<main>
  <header>
    <div class="cover">
      <div class="cover-title">
        <p>The UK has been described as an</p>
        <h1>
          <div>Elected</div>
          <div>Dictatorship</div>
        </h1>
        <p>
          Because a government with a big enough
          <strong>majority</strong>
          can essentially do what it wants
        </p>
      </div>
    </div>
  </header>
  <section class="history">
    <div>history</div>
    <div>history</div>
    <div>history</div>
    <div>history</div>
    <div>history</div>
  </section>
</main>
