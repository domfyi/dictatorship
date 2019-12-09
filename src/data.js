import { convertCSVToArray } from "convert-csv-to-array";

export const parties = {
  CON: "rgb(0, 144, 235)",
  LAB: "rgb(227, 7, 2)",
  LIB: "rgb(232, 160, 0)"
};

const acts_url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTmccYW6VEGjZRN926Bi8v-QTbzmLW9mcTM0UvMzmF8iH3zel_yHdTPand5eM_VpY6B5fgv18j-SBp8/pub?gid=0&single=true&output=tsv";

export const getActs = async () => {
  const data = await fetch(acts_url);
  const tsv = await data.text();
  const arrayofObjects = convertCSVToArray(tsv, {
    header: false,
    separator: "\t"
  });
  const actMap = arrayofObjects.reduce((list, act) => {
    if (!act.Date || !act.Date.length) return list;
    const key = act.Date.slice(0, 7);
    if (act["Visible"] !== "TRUE") return list;
    if (!list[key]) list[key] = [];
    list[key].push(act);
    return list;
  }, {});
  return actMap;
};

export const pms = [
  {
    name: "Boris Johnson",
    nickname: "Boris",
    party: "CON",
    image: "Johnson.png",
    majority: [
      {
        date: "2019-07-24",
        majority: -5,
        seats: 650
      }
    ]
  },
  {
    name: "Theresa May",
    nickname: "Theresa",
    party: "CON",
    image: "May.png",
    majority: [
      {
        date: "2017-06-08",
        majority: -5,
        seats: 650
      },
      {
        date: "2016-07-13",
        majority: 12,
        seats: 650
      }
    ]
  },
  {
    name: "David Cameron",
    nickname: "Cameron",
    party: "CON",
    image: "Cameron.png",
    majority: [
      {
        date: "2015-05-07",
        majority: 12,
        seats: 650
      },
      {
        date: "2010-05-11",
        majority: 78,
        seats: 650,
        coalition: "Lib Dems"
      }
    ]
  },
  {
    name: "Gordon Brown",
    nickname: "Brown",
    party: "LAB",
    image: "Brown.png",
    majority: [
      {
        date: "2007-06-27",
        majority: 66,
        seats: 646
      }
    ]
  },
  {
    name: "Tony Blair",
    nickname: "Blair",
    party: "LAB",
    image: "Blair.png",
    majority: [
      {
        date: "2005-05-05",
        majority: 66,
        seats: 646
      },
      {
        date: "2001-06-07",
        majority: 167,
        seats: 659
      },
      {
        date: "1997-05-02",
        majority: 179,
        seats: 659
      }
    ]
  },
  {
    name: "John Major",
    nickname: "Major",
    party: "CON",
    image: "Major.png",
    majority: [
      {
        date: "1992-04-09",
        majority: 21,
        seats: 651
      },
      {
        date: "1990-11-28",
        majority: 21,
        seats: 651
      }
    ]
  },
  {
    name: "Margeret Thatcher",
    nickname: "Maggie",
    party: "CON",
    image: "Thatcher.png",
    majority: [
      {
        date: "1987-06-11",
        majority: 102,
        seats: 650
      },
      {
        date: "1983-06-09",
        majority: 144,
        seats: 650
      },
      {
        date: "1979-05-03",
        majority: 43,
        seats: 635
      }
    ]
  },
  {
    name: "James Callaghan",
    nickname: "Callaghan",
    party: "LAB",
    image: "Callaghan.png",
    majority: [
      {
        date: "1976-04-05",
        majority: 3,
        seats: 635
      }
    ]
  },
  {
    name: "Harold Wilson",
    nickname: "Wilson",
    party: "LAB",
    image: "Wilson.png",
    majority: [
      {
        date: "1974-10-10",
        majority: 3,
        seats: 635
      },
      {
        date: "1974-03-04",
        majority: -33,
        seats: 635
      }
    ]
  },
  {
    name: "Edward Heath",
    nickname: "Ed Heath",
    party: "CON",
    image: "Heath.png",
    majority: [
      {
        date: "1970-06-19",
        majority: 30,
        seats: 630
      }
    ]
  },
  {
    name: "Harold Wilson",
    nickname: "Wilson",
    party: "LAB",
    image: "Wilson.png",
    majority: [
      {
        date: "1966-03-31",
        majority: 98,
        seats: 630
      },
      {
        date: "1964-10-16",
        majority: 4,
        seats: 630
      }
    ]
  },
  {
    name: "Alec Douglas-Home",
    nickname: "Home",
    party: "CON",
    image: "Home.png",
    majority: [
      {
        date: "1963-10-19",
        majority: 100,
        seats: 630
      }
    ]
  },
  {
    name: "Harold Macmillan",
    nickname: "Macmillan",
    party: "CON",
    image: "Macmillan.png",
    majority: [
      {
        date: "1959-10-08",
        majority: 100,
        seats: 630
      },
      {
        date: "1957-01-10",
        majority: 60,
        seats: 630
      }
    ]
  },
  {
    name: "Anthony Eden",
    nickname: "Eden",
    party: "CON",
    image: "Eden.png",
    majority: [
      {
        date: "1955-05-26",
        majority: 60,
        seats: 630
      },
      {
        date: "1955-04-06",
        majority: 17,
        seats: 625
      }
    ]
  },
  {
    name: "Winston Churchill",
    nickname: "Churchill",
    party: "CON",
    image: "Churchill.png",
    majority: [
      {
        date: "1951-10-26",
        majority: 17,
        seats: 625
      }
    ]
  },
  {
    name: "Clement Attlee",
    nickname: "Atlee",
    party: "LAB",
    image: "Atlee.png",
    majority: [
      {
        date: "1950-02-23",
        majority: 5,
        seats: 625
      },
      {
        date: "1945-07-05",
        majority: 146,
        seats: 640
      }
    ]
  }
  // {
  //   date: "1940-05-10",
  //   name: "Winston Churchill",
  //   nickname: "Churchill",
  //   party: "CON",
  //   image: "Churchill.png",
  //   majority: []
  // },
  // {
  //   date: "1937-05-28",
  //   name: "Neville Chamberlain",
  //   nickname: "Chamberlain",
  //   party: "CON",
  //   image: "Chaimberlain.png",
  //   majority: []
  // },
  // {
  //   date: "1935-06-07",
  //   name: "Stanley Baldwin",
  //   nickname: "Baldwin",
  //   party: "CON",
  //   image: "Baldwin.png",
  //   majority: []
  // },
  // {
  //   date: "1929-06-05",
  //   name: "Ramsay MacDonald",
  //   nickname: "MacDonald",
  //   party: "LAB",
  //   image: "MacDonald.png",
  //   majority: []
  // },
  // {
  //   date: "1924-11-04",
  //   name: "Stanley Baldwin",
  //   nickname: "Baldwin",
  //   party: "CON",
  //   image: "Baldwin.png",
  //   majority: []
  // },
  // {
  //   date: "1924-01-22",
  //   name: "Ramsay MacDonald",
  //   nickname: "MacDonald",
  //   party: "LAB",
  //   image: "MacDonald.png",
  //   majority: []
  // },
  // {
  //   date: "1923-05-22",
  //   name: "Stanley Baldwin",
  //   nickname: "Baldwin",
  //   party: "CON",
  //   image: "Baldwin.png",
  //   majority: []
  // },
  // {
  //   date: "1922-10-23",
  //   name: "Bonar Law",
  //   nickname: "Bonar Law",
  //   party: "CON",
  //   image: "Bonar-Law.png",
  //   majority: []
  // },
  // {
  //   date: "1916-12-06",
  //   name: "David Lloyd George",
  //   nickname: "Lloyd G",
  //   party: "LIB",
  //   image: "Lloyd-George.png",
  //   majority: []
  // },
  // {
  //   date: "1908-04-08",
  //   name: "H. H. Asquith",
  //   nickname: "Asquith",
  //   party: "LIB",
  //   image: "Asquith.png",
  //   majority: []
  // },
  // {
  //   date: "1905-12-05",
  //   name: "Henry Campbell-Bannerman",
  //   nickname: "Bannerman",
  //   party: "LIB",
  //   image: "Campbell-Bannerman.png",
  //   majority: []
  // },
  // {
  //   date: "1902-07-12",
  //   name: "Arthur Balfour",
  //   nickname: "Balfour",
  //   party: "CON",
  //   image: "Balfour.png",
  //   majority: []
  // }
];

export let majorities = [
  ...[...pms]
    .filter(pm => pm.majority && pm.majority.length)
    .map(pm => pm.majority)
];
