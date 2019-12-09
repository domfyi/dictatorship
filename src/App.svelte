<script>
  import { onMount, afterUpdate } from "svelte";
  import { pms, parties, majorities, getActs } from "./data.js";
  import moment from "moment";
  import textFit from "textfit";

  let y;
  let height;
  let observerIsSet = false;

  let currentPM = 0;
  let currentDate = moment(new Date()).format("MMM YYYY");
  let currentSeats = pms[0].majority[0].seats;
  let currentMajority = pms[0].majority[0].majority;
  let currentAct = "";
  let currentActName = "";
  let currentActLink = "";
  let currentActDate = "";

  const setTextSize = () => {
    setTimeout(() => {
      textFit(document.getElementsByClassName("current-act"), {
        multiLine: true,
        alignVert: true,
        alignHoriz: true
      });
    }, 0);
  };

  let acts = false;

  $: pm1 = pms[currentPM || 0];
  $: pm2 = pms[currentPM + 1 || 0];
  $: pm3 = pms[currentPM + 2 || 0];

  const setActs = async () => {
    acts = await getActs();
  };
  setActs();

  const unique_majorities = [
    ...new Set(majorities.flat().map(({ majority }) => majority))
  ];
  const min_majority = 0;
  const ave_majority =
    unique_majorities.reduce((sum, x) => sum + x) / unique_majorities.length;
  const max_majority = Math.max(...unique_majorities);
  const half_star_first_half = ave_majority / 5;
  const half_star_second_half = (max_majority - ave_majority) / 5;
  const star_boundries = [
    0,
    half_star_first_half * 2,
    half_star_first_half * 4,
    ave_majority + half_star_second_half,
    ave_majority + half_star_second_half * 3
  ];

  $: animations = {
    cover: {
      startFade: (height / 4) * 0
    },
    pm1: {
      left: 800
    },
    pm2: {
      up: 710,
      down: 760
    },
    pm3: {
      up: 730,
      down: 780
    },
    pms: {
      up1: 500,
      pause: 950,
      up2: 1350,
      stop: 1500
    }
  };

  function monthDiff(dateFrom, dateTo) {
    return (
      dateTo.getMonth() -
      dateFrom.getMonth() +
      12 * (dateTo.getFullYear() - dateFrom.getFullYear())
    );
  }

  let observer = new IntersectionObserver(
    (entries, observer) => {
      const entry = entries.filter(e => e.isIntersecting)[0];
      if (!entry) return;
      if (!entry.isIntersecting) return;
      const observer_month = entry.target.getAttribute("month");
      if (observer_month) currentDate = observer_month;
      const observer_maj = entry.target.getAttribute("maj");
      if (observer_maj) currentMajority = observer_maj;
      const observer_seats = entry.target.getAttribute("seats");
      if (observer_seats) currentSeats = observer_seats;
      const observer_pm = entry.target.getAttribute("pm");
      if (observer_pm) currentPM = Math.max(0, +observer_pm);
      const observer_actname = entry.target.getAttribute("actName");
      if (observer_actname) currentActName = observer_actname;
      const observer_actlink = entry.target.getAttribute("actLink");
      if (observer_actname) currentActLink = observer_actlink;
      const observer_actdate = entry.target.getAttribute("actDate");
      if (observer_actdate) currentActDate = observer_actdate;
      const observer_act = entry.target.getAttribute("act");
      if (observer_act && observer_act !== currentAct) {
        currentAct = "";
        setTimeout(() => {
          currentAct = observer_act;
          setTextSize();
        }, 50);
      }
      const observer_resetAct = entry.target.getAttribute("resetAct");
      if (
        observer_resetAct &&
        observer_resetAct !== "false" &&
        observer_pm !== currentPM
      ) {
        currentAct = false;
        currentActName = false;
        currentActLink = false;
        currentActDate = false;
      }
    },
    { rootMargin: "-36% 0px -63% 0px", threshold: 0 }
  );

  onMount(() =>
    window.addEventListener("scroll", e => {
      if (y < animations.pms.stop) {
        currentPM = 0;
        currentAct = false;
        currentActName = false;
        currentActLink = false;
        currentActDate = false;
        currentSeats = pms[0].majority[0].seats;
        currentMajority = pms[0].majority[0].majority;
        currentDate = moment(new Date()).format("MMM YYYY");
      }
    })
  );

  afterUpdate(() => {
    if (observerIsSet || !acts) return;
    document.body.style.width = document.body.style.width - 0.0001;
    document.querySelectorAll(".scroll").forEach(month => {
      observer.unobserve(month);
      observer.observe(month);
    });
    observerIsSet = true;
  });

  $: victorianPoint =
    y && document.documentElement.scrollHeight - height - height / 3;

  const setpmsBottom = () => {
    const { up1, pause, up2, stop } = animations.pms;
    const pmHeight = height / 3;
    const startPoint = 0;
    const midPoint = height - height / 2 - pmHeight / 4;
    const endPoint = height - pmHeight + 4;
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
    if (y > victorianPoint) {
      currentActName = false;
      currentAct = false;
      currentActLink = false;
    }
    console.log({
      endPoint,
      y,
      victorianPoint,
      height,
      sh: document.documentElement.scrollHeight
    });
    const pmBottom =
      y === 0
        ? 0
        : y > up1 && y <= pause
        ? (y - up1) * firstHalfPxPerPx
        : y > pause && y <= up2
        ? midPoint
        : y > up2 && y <= stop
        ? midPoint + (y - up2) * secondHalfPxPerPx
        : y > stop
        ? endPoint
        : startPoint;
    return Math.round(pmBottom);
  };
  $: pmsBottom = setpmsBottom(y, height);

  const getMajorityEndDate = (i, i_m) => {
    let start;
    if (majorities[i][i_m - 1]) {
      start = majorities[i][i_m - 1];
    } else {
      start = [...majorities[i - 1]].pop();
    }
    return start ? start.date : false;
  };
  const getMajorityDateRange = (i, i_m) => {
    if (!majorities[i][i_m]) return { diff: 0 };
    const start = new Date(majorities[i][i_m].date);
    const end =
      i + i_m === 0 ? new Date() : new Date(getMajorityEndDate(i, i_m));
    if (!start) return { diff: 0 };
    const diff = monthDiff(new Date(start), new Date(end));
    return { i, i_m, end, start, diff: Math.max(0, diff) };
  };

  const calculateMajorityWidth = ({ majority, seats }) => {
    return ((seats / 2 + majority) / seats) * 100;
  };

  const getActsFromMonth = ({ i, i_m, i_m_m }) =>
    acts[
      `${moment(getMajorityDateRange(i, i_m).end)
        .subtract(i_m_m, "months")
        .format("YYYY-MM")}`
    ] || [];

  $: actTitleOpacity =
    y > animations.pms.up1 + 100
      ? 1 - (y - (animations.pms.up1 + 100)) / 100
      : y > animations.cover.startFade + 200
      ? 0 + (y - (animations.cover.startFade + 200)) / 100
      : 0;

  $: firstMajorityScale =
    y < animations.pms.pause
      ? 0
      : y < animations.pms.up2
      ? Math.max(0, Math.min((y - animations.pms.pause) / 50, 3))
      : Math.max(1, 3 - (y - animations.pms.up2) / 50);

  const isActClose = month => {
    return (
      ![-4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(
          m =>
            acts[
              moment(month)
                .add(m, "months")
                .format("YYYY-MM")
            ]
        )
        .filter(Boolean).length > 0
    );
  };
</script>

<style>
  main,
  .overlay,
  .current-act-name {
    width: 100%;
    max-width: 700px;
  }
  main {
    text-align: center;
    margin: 0 auto;
    overflow: hidden;
  }
  .main-inner {
    background: #222;
  }
  .history {
    background: #fff;
  }
  .main-inner,
  .overlay-inner {
    margin: 0 auto;
  }
  header {
    height: 100vh;
    /* padding-bottom: 760px; */
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
    display: block;
    font-weight: 200;
    margin-top: 2rem;
  }
  header p strong {
    border-bottom: 2px solid #333;
    padding-bottom: 1px;
  }
  .first-pm {
    opacity: 0;
    margin-top: 0;
    padding-top: 0;
    height: 0;
  }
  h1,
  .majority-text,
  .victorian-title,
  .majority-header,
  .current-act,
  .victorians,
  .act45-title {
    font-family: "Big Shoulders Display";
  }
  .victorian-title {
    font-weight: 100;
    letter-spacing: 2px;
  }
  h1 {
    background: url("https://thumbs.gfycat.com/PastelCloudyGelding-size_restricted.gif");
    background-size: cover;
    background-position: center center;
    text-transform: uppercase;
    font-size: 4rem;
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
  .majority-header {
    bottom: 11vh;
    font-size: 2.5rem;
    letter-spacing: 1px;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 2rem;
    color: rgb(0, 144, 235);
    display: inline-block;
    right: 0;
    position: absolute;
    text-align: right;
    margin-right: 1rem;
  }
  .majority-header-date {
    opacity: 0.5;
    font-size: 2rem;
    margin-right: -4px;
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
    margin-left: -25%;
    z-index: 1;
    height: 80%;
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
  .pm2 {
    margin-left: 25%;
    z-index: 2;
    height: 90%;
    animation-duration: 0.8s;
    animation-delay: 0.15s;
    margin-bottom: -22px !important;
    filter: brightness(75%);
  }
  .act-name {
    transition: 0.5s all;
  }
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
    margin-top: 20px;
    margin-bottom: 16px;
    transition: 0.2s all;
  }
  .mini-pm {
    height: 100px;
    filter: grayscale(0.66);
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
    background: #444;
    color: #676767;
    font-weight: 200;
    letter-spacing: 2px;
  }
  .victorian-title {
    font-size: 3rem;
    text-transform: uppercase;
    margin: 1rem;
  }
  .pm-avatar {
    border-bottom: 3px solid #222;
  }
  .pm-avatar-border {
    height: 8px;
    background: blue;
  }
  .majority-container {
    margin: 0 auto;
  }
  .month,
  .current-act-name div {
    padding: 6px;
    background: #f6f6f6;
    margin-bottom: 4px;
    border-radius: 32px;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: #aaa;
  }
  .month.act,
  .current-act-name div {
    color: #fff;
    padding: 7px 0;
  }
  .current-act {
    border-radius: 8px;
    position: absolute;
    top: 0.5rem;
    right: 0;
    left: 33%;
    bottom: 18vh;
    background-color: var(--my-color-var);
    color: #fff;
    border-radius: 0.6em;
    font-weight: 800;
    text-transform: uppercase;
    z-index: 200;
  }

  .current-act:after {
    content: "";
    position: absolute;
    left: 0;
    top: 75%;
    width: 0;
    height: 0;
    border: 29px solid transparent;
    border-right-color: var(--my-color-var);
    z-index: 200;
    border-left: 0;
    border-bottom: 0;
    margin-top: -14.5px;
    margin-left: -29px;
  }
  .current-act .inner {
    padding: 0.5rem 1rem;
  }

  .current-act-name {
    position: fixed;
    top: calc(33vh);
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding-top: 9px;
  }

  .current-act-name div {
    margin: 0 auto;
  }

  .majority-title {
    margin-top: 2.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #c6c6c6;
  }

  .majority-title.first-majority {
    padding-top: 3rem;
    margin-bottom: -1.75rem;
  }

  .fa-star {
    margin: 2px 0;
  }
  .created-by {
    font-size: 4rem;
    margin: 1rem 0;
  }
  .author {
    padding: 1rem;
    display: inline-block;
    text-decoration: none;
  }
  .author div {
    color: #757575;
  }
  .author .domfyi {
    margin-top: 3px;
    font-size: 1.5rem;
    color: #fff;
    margin-right: -13px;
    font-weight: 200;
  }

  .act45-title {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    color: #fff;
    z-index: 300;
  }

  .act45-title h2 {
    font-size: 4rem;
    font-weight: 200;
    margin: 0;
  }

  .act45-title div {
    letter-spacing: 2px;
    font-size: 1.3rem;
    color: #a9a9a9;
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
</style>

<svelte:window bind:scrollY={y} bind:innerHeight={height} />
{#if acts}
  <main>
    <div class="main-inner">
      <header>
        <div
          class="cover"
          style={`
          opacity: ${1 - y / 200};
		background-image: linear-gradient(
			rgba(200,200,200,1), 
			rgba(200,200,200,${y < animations.cover.startFade ? 1 : 1 - (y - animations.cover.startFade) / 1000}),
			rgba(200,200,200,${y < animations.cover.startFade ? 1 : 1 - (y - animations.cover.startFade) / 100})
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
      {#if currentAct}
        <div class="current-act-name">
          <a href={currentActLink} target="_blank">
            <div
              style={`background: ${parties[pms[currentPM].party]}; width: ${calculateMajorityWidth(
                {
                  majority: +currentMajority,
                  seats: +currentSeats
                }
              )}%`}>
              {currentActName}
            </div>
          </a>
        </div>
      {/if}
      <div
        class="act45-title"
        style={`bottom: calc(22vh + ${pmsBottom}px); opacity: ${actTitleOpacity}`}>
        <h2>acts</h2>
        <div>— since 1945 —</div>
      </div>
      <div
        class="overlay"
        style={`bottom: ${pmsBottom}px; background: ${y > height ? '#222' : 'none'}; transform: translateX(-50%) translateY(-${y < victorianPoint ? 0 : y - victorianPoint}px)`}>
        <div class="ovelay-inner">
          {#if currentAct}
            <div
              class="current-act"
              style={`--my-color-var: ${parties[pms[currentPM].party].replace(')', ',0.5)')};`}>
              <div class="inner">{currentAct}</div>
            </div>
          {/if}
          <div
            class="majority-header"
            style={`
		  	color: ${parties[pms[currentPM].party]}; 
		  	transform: translateY(${y < animations.pms.pause ? 100 : Math.max(0, 250 - (y - animations.pms.pause))}px)
		  `}>
            <div>
              <span class="majority-header-date">
                {(currentActDate || currentDate).split(' ')[0]}
              </span>
              <span>
                {(currentActDate || currentDate).split(' ')[1].slice(2)}
              </span>
            </div>
          </div>
          <div class="pms">
            <img
              alt="pm2"
              style={`opacity: ${pm2 ? 1 : 0}`}
              class={`pm2 ${y > animations.pm2.down ? 'bounceOutDown' : 'bounceInUp'} animated`}
              src={pm2 && `/pms/${pm2.image}`} />
            {#if pms[currentPM]}
              <img
                alt="pm1"
                class={`pm1 ${y > animations.pm1.left ? 'left' : ''}`}
                src={`/pms/${pms[currentPM].image}`} />
            {/if}
            <img
              alt="pm3"
              style={`opacity: ${pm3 ? 1 : 0}`}
              class={`pm3 ${y > animations.pm3.down ? 'bounceOutDown' : 'bounceInUp'} animated`}
              src={pm3 && `/pms/${pm3.image}`} />
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
      <section
        class="history"
        style={`margin-top: ${-pmsBottom + (y < animations.pms.stop ? y : animations.pms.stop)}px;`}>
        <div
          class="majority-title first-majority"
          style={`transform: scale(${firstMajorityScale}); padding-top: calc(3rem + ${y < animations.pms.up2 ? 0 : Math.min(y - animations.pms.up2, 200)}px)`}>
          <div>{pms[0].majority[0].majority < 0 ? 'no ' : ''} majority</div>
          <div>
            {#each new Array(5) as _, i_star}
              <i
                class="fas fa-star"
                style={`color: ${pms[0].majority[0].majority > star_boundries[i_star] ? 'rgb(232, 209, 0)' : '#c6c6c6'};`} />
            {/each}
          </div>
        </div>
        <div
          class="history-body"
          style={`opacity: ${y < animations.pms.up2 + 100 ? 0 : (y - animations.pms.up2 - 100) / 100}`}>
          {#each pms as pm, i}
            <div class="pm " {i}>
              <div
                class={`scroll mini-pm-container ${i === 0 && 'first-pm'}`}
                style={`opacity: ${currentPM === i ? 0 : 1}`}
                pm={i}
                resetAct={true}>
                <div class="pm-avatar animated">
                  <img
                    alt="pm"
                    class="animated mini-pm"
                    {i}
                    src={`/pms/${pm.image}`} />
                  <div
                    class="pm-avatar-border"
                    style={`background: ${parties[pms[i].party]}`} />
                </div>
              </div>
              {#each pm.majority.filter(Boolean) as majority, i_m}
                <div>
                  {#if i !== 0}
                    <div class="majority-title">
                      <div>{majority.majority < 0 ? 'no ' : ''} majority</div>

                      <div>
                        {#each new Array(5) as _, i_star}
                          <i
                            class="fas fa-star"
                            style={`color: ${majority.majority > star_boundries[i_star] ? 'rgb(232, 209, 0)' : '#c6c6c6'};`} />
                        {/each}
                      </div>
                    </div>
                  {/if}
                  <div
                    class="majority-container"
                    style={`width: ${calculateMajorityWidth(majority)}%`}>
                    <div>
                      {#each Array(getMajorityDateRange(i, i_m).diff) as _, i_m_m}
                        {#if acts[`${moment(getMajorityDateRange(i, i_m).end)
                            .subtract(i_m_m, 'months')
                            .format('YYYY-MM')}`]}
                          {#each getActsFromMonth({
                            i,
                            i_m,
                            i_m_m
                          }) as month_act, i_m_m_a}
                            <a href={month_act.Link} target="_blank">
                              <div
                                class="scroll month act"
                                style={`background: ${parties[pms[i].party]}; opacity: ${month_act.Simple === currentAct ? 0 : 1}`}
                                maj={majority.majority}
                                act={month_act.Simple}
                                actName={month_act.Act}
                                actLink={month_act.Link}
                                actDate={moment(month_act.Date).format('MMM YYYY')}
                                seats={majority.seats}
                                pm={i}
                                month={moment(getMajorityDateRange(i, i_m).end)
                                  .subtract(i_m_m, 'months')
                                  .format('MMM YYYY')}>
                                <span
                                  class="act-name"
                                  style={`opacity: ${i === currentPM ? 1 : 0.2}`}>
                                  {month_act.Act}
                                </span>
                              </div>
                            </a>
                            {#if getActsFromMonth({ i, i_m, i_m_m }).length}
                              <div
                                class="scroll month"
                                pm={i}
                                month={moment(getMajorityDateRange(i, i_m).end)
                                  .subtract(i_m_m, 'months')
                                  .format('MMM YYYY')} />
                            {/if}
                          {/each}
                        {:else}
                          <div
                            class="scroll month"
                            pm={i}
                            resetAct={isActClose(moment(getMajorityDateRange(i, i_m).end).subtract(i_m_m, 'months'))}
                            month={moment(getMajorityDateRange(i, i_m).end)
                              .subtract(i_m_m, 'months')
                              .format('MMM YYYY')} />
                        {/if}
                      {/each}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/each}
          <div class="scroll month" style={'opacity:0'} resetAct={true} />
          <div class="victorians">
            <a class="author" target="_blank" href="https://dom.fyi">
              <div class="created-by">🚀</div>
              <div>created by</div>
              <div class="domfyi">dom.fyi ›</div>
            </a>
          </div>
        </div>
      </section>
    </div>
  </main>
{/if}
