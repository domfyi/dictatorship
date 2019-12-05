<script>
  import { onMount } from "svelte";
  import { pms, parties } from "./data.js";
  let y;
  let height;
  let currentPM = 0;
  $: pm1 = pms[currentPM || 0];
  $: pm2 = pms[currentPM + 1 || 0];
  $: pm3 = pms[currentPM + 2 || 0];

  //   const [pm1, pm2, pm3] = pms;
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
  onMount(() => {
    var wasAbove = false;
    let reverse = false;
    let observerDownwards = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          const isAbove = entry.boundingClientRect.y < entry.rootBounds.y;
          //   if (!isAbove && !entry.isIntersecting) return;
          if (entry.isIntersecting) console.log({ isAbove });
          if (entry.isIntersecting && !isAbove) reverse = false;
          if (!isAbove && !entry.isIntersecting) {
            if (reverse) return;
            reverse = true;
            if (entry.target.getAttribute("i") === 0) return;
            currentPM = (currentPM || 1) - 1;
            const previous = document
              .querySelectorAll(".slideOutUp")
              .forEach(element => {
                element.classList.remove("slideOutUp");
                element.classList.add("slideInDown");
              });
            console.log(
              "subtract",
              currentPM - 1,
              entry.target.getAttribute("i"),
              { isAbove },
              entry.intersectionRatio,
              entry.intersectionRect,
              entry.isIntersecting,
              entry.boundingClientRect,
              entry.rootBounds
            );
            return;
            // console.log(
            //   "set",
            //   currentPM - 1,
            //   entry.target.getAttribute("i"),
            //   { isAbove },
            //   entry.intersectionRatio,
            //   entry.intersectionRect,
            //   entry.isIntersecting
            // );
            if (entry.target.getAttribute("i") === 0) return;
            return (currentPM = Math.min(0, (currentPM || 1) - 1));
          }
          if (entry.isIntersecting) {
            const previous = document.querySelectorAll(
              ".slideOutUp, .slideInDown"
            );
            document
              .querySelectorAll(".mini-pm-container .pm-avatar")
              .forEach(element => {
                element.classList.remove("slideOutUp");
                element.classList.remove("slideInDown");
              });
            previous &&
              previous.classList &&
              previous.classList.add("slideInDown");
            entry.target
              .querySelector(".pm-avatar")
              .classList.add("slideOutUp");
            if (wasAbove) {
              if (entry.intersectionRatio < 0.5) {
                currentPM = Math.max(0, +entry.target.getAttribute("i"));
              }
            } else {
              //   console.log(entry.intersectionRatio);
              if (entry.intersectionRatio < 0.5) {
                currentPM = Math.max(0, +entry.target.getAttribute("i"));
              }
            }
          }
          wasAbove = isAbove;
        });
      },
      { rootMargin: "0px 0px -66%", threshold: 0 }
    );
    document
      .querySelectorAll(".trigger")
      .forEach(pm => observerDownwards.observe(pm));
  });

  //   let observer = new IntersectionObserver(callback, options);

  const setpmsBottom = () => {
    const { up1, pause, up2, stop } = animations.pms;
    const pmHeight = height / 3;
    const startPoint = 0;
    const midPoint = height - height / 2 - pmHeight / 2;
    const endPoint = height - pmHeight + 4;
    const victorianPoint =
      document.documentElement.scrollHeight - height * 2 - height / 3;
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
    // console.log({ y, victorianPoint });
    const pmBottom =
      y > up1 && y <= pause
        ? (y - up1) * firstHalfPxPerPx
        : y > pause && y <= up2
        ? midPoint
        : y > up2 && y <= stop
        ? midPoint + (y - up2) * secondHalfPxPerPx
        : y > stop && y <= victorianPoint
        ? endPoint
        : y > victorianPoint
        ? endPoint + (y - victorianPoint)
        : startPoint;
    const rounded = Math.round(pmBottom);
    return rounded;
  };
  $: pmsBottom = setpmsBottom(y, height);

  //   const setMajorityWidth = () => {

  // 	  pms[currentPM]
  //   };
  //   $: majorityWidth = setMajorityWidth(y);
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
    font-size: 1rem;
    opacity: 0.66;
    text-align: right;
    display: block;
    font-weight: 200;
    margin-top: 6px;
  }

  header p strong {
    border-bottom: 2px solid #333;
    padding-bottom: 1px;
  }

  .first-pm {
    opacity: 0;
  }

  @media only screen and (max-width: 600px) {
    .pms {
      /* transform: scale(0.7);
      transform-origin: bottom; */
    }
  }

  h1,
  .majority-text,
  .victorian-title {
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
    font-size: 4rem;
    /* font-weight: 300; */
    padding: 2rem;
    border-top: 3px solid #222;
    border-bottom: 3px solid #222;
    margin-left: -20px;
    margin-right: -20px;
    color: #fff;
    letter-spacing: 1px;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  h1,
  header p {
    transform: rotate(-2.6deg);
  }
  header p:first-child {
    font-size: 1.4rem;
  }
  h1 div:first-child {
    font-size: 5rem;
    line-height: 5rem;
    border-bottom: 2px solid #eee;
    max-width: 380px;
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
    display: flex;
    flex-direction: column;
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
    transition: 0.8s all 0.3s;
  }
  .pm1.left {
    margin-left: -33%;
  }

  @media only screen and (max-width: 600px) {
    .pm1.left {
      transform: scale(0.8);
      transform-origin: bottom;
    }
    .majority-text {
      transform: scale(0.8);
      transform-origin: right;
    }
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
    margin-bottom: 100px;
  }
  .mini-pm {
    height: 100px;
    filter: grayscale(0.66);
    /* opacity: 0.75; */
    margin-bottom: -13px;
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
  .victorians {
    height: 100vh;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .victorian-inner {
    /* padding-top: 50%;
    transform: translateY(-50%); */
  }
  .victorian-title {
    font-size: 3rem;
    text-transform: uppercase;
    margin: 1rem;
  }
  .victorians img {
    height: 50vh;
  }
  .created-by {
    height: 100vh;
    background: #444;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pm-avatar {
    border-bottom: 3px solid #222;
  }
  .pm-avatar-border {
    height: 8px;
    background: blue;
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
              Because a government elected with a big enough majority can
              <strong>essentially do what it wants</strong>
              .
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
          {#if pm2}
            <img
              alt="pm2"
              class={`pm2 ${y > animations.pm2.down ? 'bounceOutDown' : 'bounceInUp'} animated`}
              src={`/pms/${pm2.image}`} />
          {/if}
          {#if pms[currentPM]}
            <img
              alt="pm1"
              class={`pm1 ${y > animations.pms.pause ? 'left' : ''}`}
              src={`/pms/${pms[currentPM].image}`} />
          {/if}
          {#if pm3}
            <img
              alt="pm3"
              class={`pm3 ${y > animations.pm3.down ? 'bounceOutDown' : 'bounceInUp'} animated`}
              src={`/pms/${pm3.image}`} />
          {/if}
        </div>
        <div
          class={`majority`}
          style={`background: ${parties[pms[currentPM].party]}`}>
          <span
            class="majority-text"
            style={`transform: translateY(${y < animations.pms.pause ? 100 : Math.max(0, 100 - (y - animations.pms.pause))}px)`}>
            {pms[currentPM].nickname}
          </span>
        </div>
        <span class="scroll-down" style="opacity: {1 - Math.max(0, y / 80)}">
          ˅
        </span>
      </div>
    </div>
    <section class="history">
      {#each pms as pm, i}
        <div class="pm " {i}>
          <div class={`trigger mini-pm-container ${i === 0 && 'first-pm'}`} {i}>
            <div class="pm-avatar animated">
              <img class="animated mini-pm" {i} src={`/pms/${pm.image}`} />
              <div
                class="pm-avatar-border"
                style={`background: ${parties[pms[i].party]}`} />
            </div>
          </div>
        </div>
      {/each}
      <div class="victorians">
        <div class="victorian-inner">
          <img src="pms/Victorians.png" />
          <div class="victorian-title">victorians</div>
        </div>
      </div>
      <div class="created-by">created by</div>
    </section>
  </div>
</main>
