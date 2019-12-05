<script>
  import { pms, parties } from "./data.js";
  const [pm1, pm2, pm3] = pms;
  let y;
  let height;
  $: animations = {
    cover: {
      startFade: (height / 4) * 0
    },
    pm2: {
      up: 10,
      down: 60
    },
    pm3: {
      up: 30,
      down: 80
    },
    pms: {
      up1: 100,
      pause: 550,
      up2: 950,
      stop: 1100
    }
  };

  const setpmsBottom = () => {
    const { up1, pause, up2, stop } = animations.pms;
    const pmHeight = height / 3;
    const startPoint = 0;
    const midPoint = height - height / 2 - pmHeight / 2;
    const endPoint = height - pmHeight;
    const firstHalfDistance = midPoint - startPoint;
    const firstHalfTime = pause - up1;
    const secondHalfDistance = endPoint - midPoint;
    const secondHalfTime = stop - up2;
    const timeDistanceToPixels = (t, d) => d / t;
    const firstHalfPxPerPx = timeDistanceToPixels(
      firstHalfTime,
      firstHalfDistance
    );
    const secondHalfPxPerPx = timeDistanceToPixels(
      secondHalfTime,
      secondHalfDistance
    );
    const pmBottom =
      y > up1 && y <= pause
        ? (y - up1) * firstHalfPxPerPx
        : y > pause && y <= up2
        ? midPoint
        : y > up2 && y <= stop
        ? midPoint + (y - up2) * secondHalfPxPerPx
        : y > stop
        ? endPoint
        : startPoint;
    const rounded = Math.round(pmBottom);
    console.log(rounded);
    return rounded;
  };
  $: pmsBottom = setpmsBottom(y, height);
</script>

<style>
  main,
  .overlay {
    max-width: 700px;
  }
  main {
    text-align: center;
    margin: 0 auto;
    overflow: hidden;
  }
  .main-inner {
    background: #fff;
  }
  .main-inner,
  .overlay-inner {
    margin: 0 auto;
  }

  header {
    height: 100vh;
    padding-bottom: 800px;
  }

  header p {
    margin: 0;
    padding: 0;
    padding: 0 5vw;
    font-size: 1.4rem;
    color: #222;
    line-height: 2rem;
  }

  p .citation {
    font-size: 0.9rem;
    opacity: 0.66;
    text-align: right;
    display: block;
    font-weight: 200;
  }

  header p strong {
    border-bottom: 2px solid #333;
    padding-bottom: 1px;
  }

  h1,
  .majority-text {
    /* font-family: "Amatic SC", cursive; */
    font-family: "Big Shoulders Display";
    /* font-family: "Big Shoulders Display", cursive; */
    /* font-family: "Zilla Slab Highlight", cursive; */
    /* font-family: "Single Day"; */
  }

  h1 {
    background: url("https://thumbs.gfycat.com/PastelCloudyGelding-size_restricted.gif");
    background-size: cover;
    background-position: center center;
    text-transform: uppercase;
    font-size: 3rem;
    /* font-weight: 300; */
    padding: 4rem 2rem;
    border-top: 3px solid #222;
    border-bottom: 3px solid #222;
    margin-left: -20px;
    margin-right: -20px;
    color: #fff;
    letter-spacing: 1px;
  }
  h1,
  header p {
    transform: rotate(-2.6deg);
  }
  header p:first-child {
    font-size: 1.5rem;
  }
  h1 div:first-child {
    font-size: 4rem;
    line-height: 4rem;
    border-bottom: 2px solid #eee;
    width: 380px;
    margin: 0 auto;
  }
  section.history {
  }

  .cover {
    height: 110vh;
  }

  .cover-inner {
    height: 75vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cover-title {
    width: 100%;
  }
  .overlay {
    text-align: center;
    height: 33vh;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    border-bottom: 6px solid #222;
    margin-bottom: -6px;
  }
  .majority,
  .overlay {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .pms {
    display: flex;
    flex-direction: row;
    justify-content: center;
    vertical-align: bottom;
    height: 66%;
  }
  .pms > div {
    height: 100%;
    vertical-align: bottom;
    height: 100%;
  }
  .pms img {
    width: auto;
    position: absolute;
    bottom: 0px;
    margin-bottom: -10px;
  }
  .pm3 {
    margin-left: -25vh;
    z-index: 1;
    height: 80%;
    /* transition: 0.75s all; */
    animation-duration: 0.8s;

    margin-bottom: -22px !important;
    filter: brightness(60%);
  }
  .pm1 {
    z-index: 3;
    height: 100%;
    transition: 0.8s all;
  }
  .pm1.left {
    margin-left: -33%;
  }
  .pm2 {
    margin-left: 25vh;
    z-index: 2;
    height: 90%;
    animation-duration: 0.8s;
    animation-delay: 0.15s;
    margin-bottom: -22px !important;
    filter: brightness(75%);
  }
  /* .pms img.up {
    margin-bottom: -1px;
  }
  .pms img.down {
    margin-bottom: -33vh;
  } */
  .scroll-down {
    color: white;
    z-index: 4;
    opacity: 1;
    position: fixed;
    bottom: 0;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    z-index: 4;
    margin-left: -10px;
    margin-bottom: 4px;
    background: rgba(107, 107, 107, 0.75);
    color: black;
    font-size: 2rem;
    display: none;
  }
  .majority {
    height: 33% !important;
    background: red;
    width: 100%;
    line-height: 12vh;
    font-size: 8vh;
    font-weight: bold;
    letter-spacing: 1px;
    color: #fff;
    text-align: right;
  }
  .majority-text {
    margin-right: 1rem;
    display: inline-block;
    color: #222;
    text-transform: uppercase;
  }
  .mini-pm-container {
    margin-top: 100px;
    border-bottom: 1px solid #333;
  }
  .mini-pm {
    height: 100px;
    filter: grayscale(0.66);
    opacity: 0.75;
    margin-bottom: -4px;
    font-weight: 100;
  }
  .mini-pm-name {
    padding-top: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #444;
  }
  .mini-pm-date {
    letter-spacing: 1px;
    color: #888;
    font-size: 0.8rem;
    border-top: 1px solid #d1d1d1;
    margin-top: 2px;
    padding: 2px 4px 0 4px;
    display: inline-block;
    margin-bottom: 200px;
  }
  .sic {
    opacity: 0.66;
  }
</style>

<svelte:window bind:scrollY={y} bind:innerHeight={height} />
<main>
  <div class="main-inner">
    <header>

      <div
        class="cover"
        style={`
		background-image: linear-gradient(
			rgba(179,179,179,1), 
			rgba(179,179,179,${y < animations.cover.startFade ? 1 : 1 - (y - animations.cover.startFade) / 1000}),
			rgba(179,179,179,${y < animations.cover.startFade ? 1 : 1 - (y - animations.cover.startFade) / 100})
		);
	  `}>
        <div class="cover-inner">
          <div
            class="cover-title"
            style={`margin-top: -${Math.min(y, 1000)}px`}>
            <p>The UK has been described as an</p>
            <h1>
              <div>Elective</div>
              <div>Dictatorship</div>
            </h1>
            <p>
              Because a government elected with a big enough
              <strong>majority</strong>
              can essentially do what it wants.
              <span class="citation">— Lord Hailsham</span>
            </p>
          </div>
        </div>
      </div>
    </header>
    <div
      class="overlay"
      style={`bottom: ${pmsBottom}px; background: ${y > height ? '#fff' : 'none'}`}>
      <div class="ovelay-inner">
        <div class="pms">
          <img
            alt="pm2"
            class={`pm2 ${y > animations.pm2.down ? 'bounceOutDown' : 'bounceInUp'} animated`}
            src={`/pms/${pm2.image}`} />
          <img
            alt="pm1"
            class={`pm1 ${y > animations.pms.pause ? 'left' : ''}`}
            src={`/pms/${pm1.image}`} />
          <img
            alt="pm3"
            class={`pm3 ${y > animations.pm3.down ? 'bounceOutDown' : 'bounceInUp'} animated`}
            src={`/pms/${pm3.image}`} />
        </div>
        <div class={`majority`} style={`background: ${parties[pm1.party]}`}>
          <span
            class="majority-text"
            style={`transform: translateY(${y < animations.pms.pause ? 100 : Math.max(0, 100 - (y - animations.pms.pause))}px)`}>
            {pm1.nickname}
          </span>
        </div>
        <span class="scroll-down" style="opacity: {1 - Math.max(0, y / 80)}">
          ˅
        </span>
      </div>
    </div>
    <section class="history">
      {#each pms.slice(1) as pm}
        <div class="mini-pm-container">
          <img class="mini-pm" src={`/pms/${pm.image}`} />
        </div>
        <div class="mini-pm-name">{pm.nickname}</div>
        <div class="mini-pm-date">
          <span>{pm.date.slice(0, 4)}</span>
        </div>
      {/each}
    </section>
  </div>
</main>
