// Cash Shop Types
export interface CashShopCategory {
  bID: number;
  szName: string;
  wOrder: number;
}

export interface CashShopItem {
  wID: number;
  wItemId: number;
  szName: string;
  dwMoney: number;
  bCount: number;
  bCategory: number;
  wOrder: number;
}

export const cashShopCategories: CashShopCategory[] = [
  {
    bID: 3,
    szName: "Item Upgrades",
    wOrder: 3
  },
  {
    bID: 4,
    szName: "Potions",
    wOrder: 4
  },
  {
    bID: 5,
    szName: "Formula of Trans.",
    wOrder: 5
  },
  {
    bID: 6,
    szName: "Chakras",
    wOrder: 6
  },
  {
    bID: 7,
    szName: "Mounts",
    wOrder: 7
  },
  {
    bID: 8,
    szName: "Companions",
    wOrder: 8
  },  
  {
    bID: 10,
    szName: "Character and Style",
    wOrder: 9
  },
  {
    bID: 11,
    szName: "Costumes",
    wOrder: 10
  },
  {
    bID: 12,
    szName: "Special Items",
    wOrder: 11
  },
  {
    bID: 13,
    szName: "Cloaks",
    wOrder: 13
  },
  {
    bID: 14,
    szName: "Mobile",
    wOrder: 12
  }
];

export const cashShopItems: CashShopItem[] = [
{
        "wID": 1,
        "wItemId": 7719,
        "szName": "10x Master's Letter",
        "dwMoney": 39,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 1
    },
    {
        "wID": 2,
        "wItemId": 7612,
        "szName": "10x Book of Craftsmanship",
        "dwMoney": 39,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 2
    },
    {
        "wID": 3,
        "wItemId": 7611,
        "szName": "10x Book of Inspiration",
        "dwMoney": 39,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 3
    },
    {
        "wID": 5,
        "wItemId": 8505,
        "szName": "10x Alchemist's Formula",
        "dwMoney": 29,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 4
    },
    {
        "wID": 147,
        "wItemId": 7812,
        "szName": "10x Cleansing Formula",
        "dwMoney": 19,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 5
    },
    {
        "wID": 4,
        "wItemId": 7630,
        "szName": "10x Arcane Reagent",
        "dwMoney": 19,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 6
    },
    {
        "wID": 43,
        "wItemId": 7630,
        "szName": "50x Arcane Reagent",
        "dwMoney": 89,
        "bCount": 50,
        "bCategory": 3,
        "wOrder": 7
    },
    {
        "wID": 44,
        "wItemId": 7630,
        "szName": "200x Arcane Reagent",
        "dwMoney": 359,
        "bCount": 200,
        "bCategory": 3,
        "wOrder": 8
    },
    {
        "wID": 146,
        "wItemId": 7662,
        "szName": "Formula of Emptiness (Options)",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 3,
        "wOrder": 8
    },
    {
        "wID": 12,
        "wItemId": 17010,
        "szName": "10x Gemstone",
        "dwMoney": 19,
        "bCount": 10,
        "bCategory": 3,
        "wOrder": 10
    },
    {
        "wID": 13,
        "wItemId": 11604,
        "szName": "Flawless Gemstone",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 3,
        "wOrder": 11
    },
    {
        "wID": 14,
        "wItemId": 18191,
        "szName": "Perfect Gemstone",
        "dwMoney": 39,
        "bCount": 1,
        "bCategory": 3,
        "wOrder": 12
    },
    {
        "wID": 15,
        "wItemId": 30008,
        "szName": "Cash Gemstone",
        "dwMoney": 59,
        "bCount": 1,
        "bCategory": 3,
        "wOrder": 13
    },
    {
        "wID": 109,
        "wItemId": 31703,
        "szName": "Gemstone Bundle",
        "dwMoney": 349,
        "bCount": 1,
        "bCategory": 3,
        "wOrder": 14
    },
    {
        "wID": 6,
        "wItemId": 31693,
        "szName": "Speed Potion (30 Days)",
        "dwMoney": 219,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 1
    },
    {
        "wID": 9,
        "wItemId": 31698,
        "szName": "Courageousness Potion (30 Days)",
        "dwMoney": 199,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 2
    },
    {
        "wID": 7,
        "wItemId": 7600,
        "szName": "First-Class Healing Potion (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 3
    },
    {
        "wID": 8,
        "wItemId": 7689,
        "szName": "First-Class Mana Potion (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 4
    },
    {
        "wID": 149,
        "wItemId": 8204,
        "szName": "30x Speed Potion",
        "dwMoney": 29,
        "bCount": 30,
        "bCategory": 4,
        "wOrder": 5
    },
    {
        "wID": 148,
        "wItemId": 1588,
        "szName": "30x Courageousness Potion",
        "dwMoney": 29,
        "bCount": 30,
        "bCategory": 4,
        "wOrder": 6
    },
    {
        "wID": 150,
        "wItemId": 6807,
        "szName": "30x Life Ampoule",
        "dwMoney": 29,
        "bCount": 30,
        "bCategory": 4,
        "wOrder": 7
    },
    {
        "wID": 151,
        "wItemId": 7910,
        "szName": "30x Mana Ampoule",
        "dwMoney": 25,
        "bCount": 30,
        "bCategory": 4,
        "wOrder": 8
    },
    {
        "wID": 10,
        "wItemId": 30416,
        "szName": "Potion of Recklessness (1 hour)",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 9
    },
    {
        "wID": 11,
        "wItemId": 30417,
        "szName": "Potion of Recklessness (3 hours)",
        "dwMoney": 49,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 10
    },
    {
        "wID": 95,
        "wItemId": 18016,
        "szName": "Medium Luck",
        "dwMoney": 19,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 11
    },
    {
        "wID": 96,
        "wItemId": 18017,
        "szName": "Great Luck",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 4,
        "wOrder": 12
    },
    {
        "wID": 155,
        "wItemId": 24501,
        "szName": "5x Darkblue",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 1
    },
    {
        "wID": 156,
        "wItemId": 24502,
        "szName": "5x Lava",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 2
    },
    {
        "wID": 157,
        "wItemId": 24503,
        "szName": "5x Lightning",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 3
    },
    {
        "wID": 158,
        "wItemId": 24504,
        "szName": "5x Ice",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 4
    },
    {
        "wID": 159,
        "wItemId": 24505,
        "szName": "5x Blackgreen",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 5
    },
    {
        "wID": 160,
        "wItemId": 24506,
        "szName": "5x Pink",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 6
    },
    {
        "wID": 161,
        "wItemId": 24507,
        "szName": "5x Storm Blue",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 7
    },
    {
        "wID": 162,
        "wItemId": 24509,
        "szName": "5x Magma",
        "dwMoney": 99,
        "bCount": 5,
        "bCategory": 5,
        "wOrder": 8
    },
    {
        "wID": 179,
        "wItemId": 7817,
        "szName": "Formula of Emptiness (Color)",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 5,
        "wOrder": 9
    },
    {
        "wID": 16,
        "wItemId": 25008,
        "szName": "Fire Chakra",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 1
    },
    {
        "wID": 17,
        "wItemId": 25005,
        "szName": "Blue Chakra",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 2
    },
    {
        "wID": 21,
        "wItemId": 25011,
        "szName": "Enhanced Fire Chakra",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 3
    },
    {
        "wID": 87,
        "wItemId": 25012,
        "szName": "Enhanced Blue Chakra",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 3
    },
    {
        "wID": 18,
        "wItemId": 25004,
        "szName": "Dark Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 4
    },
    {
        "wID": 19,
        "wItemId": 25009,
        "szName": "Ice Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 5
    },
    {
        "wID": 20,
        "wItemId": 25010,
        "szName": "White Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 6
    },
    {
        "wID": 45,
        "wItemId": 25016,
        "szName": "Red Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 7
    },
    {
        "wID": 46,
        "wItemId": 25017,
        "szName": "Green Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 8
    },
    {
        "wID": 47,
        "wItemId": 25061,
        "szName": "Pink Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 9
    },
    {
        "wID": 48,
        "wItemId": 25020,
        "szName": "Purple Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 10
    },
    {
        "wID": 49,
        "wItemId": 25018,
        "szName": "Orange Wings",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 6,
        "wOrder": 11
    },
    {
        "wID": 152,
        "wItemId": 7708,
        "szName": "Saddle of Swiftness (7 Days)",
        "dwMoney": 59,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 1
    },
    {
        "wID": 153,
        "wItemId": 7709,
        "szName": "Saddle of Swiftness (30 Days)",
        "dwMoney": 189,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 2
    },
    {
        "wID": 177,
        "wItemId": 19091,
        "szName": "Cash Whip (7 Days)",
        "dwMoney": 79,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 3
    },
    {
        "wID": 178,
        "wItemId": 19092,
        "szName": "Cash Whip (30 Days)",
        "dwMoney": 199,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 4
    },
    {
        "wID": 23,
        "wItemId": 7866,
        "szName": "White Caribou",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 8
    },
    {
        "wID": 25,
        "wItemId": 30214,
        "szName": "White Horse",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 9
    },
    {
        "wID": 31,
        "wItemId": 31006,
        "szName": "White Buffalo",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 10
    },
    {
        "wID": 22,
        "wItemId": 8879,
        "szName": "Black Caribou",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 11
    },
    {
        "wID": 24,
        "wItemId": 8877,
        "szName": "Black Horse",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 12
    },
    {
        "wID": 88,
        "wItemId": 31313,
        "szName": "Black Buffalo",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 13
    },
    {
        "wID": 33,
        "wItemId": 30213,
        "szName": "Behemoth",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 14
    },
    {
        "wID": 34,
        "wItemId": 30208,
        "szName": "Infuriated Behemoth",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 15
    },
    {
        "wID": 27,
        "wItemId": 30207,
        "szName": "Ratha Panda",
        "dwMoney": 399,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 16
    },
    {
        "wID": 26,
        "wItemId": 30265,
        "szName": "Black Panda",
        "dwMoney": 399,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 17
    },
    {
        "wID": 28,
        "wItemId": 31320,
        "szName": "Wooden Rudolph",
        "dwMoney": 399,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 18
    },
    {
        "wID": 39,
        "wItemId": 30212,
        "szName": "Albino Tarantula",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 19
    },
    {
        "wID": 32,
        "wItemId": 30227,
        "szName": "Snow Kitsune",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 20
    },
    {
        "wID": 38,
        "wItemId": 30219,
        "szName": "Gorilla",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 21
    },
    {
        "wID": 35,
        "wItemId": 30218,
        "szName": "Hopping Cow",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 22
    },
    {
        "wID": 36,
        "wItemId": 30217,
        "szName": "Hopping Horse",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 23
    },
    {
        "wID": 29,
        "wItemId": 12076,
        "szName": "Hell Steed",
        "dwMoney": 399,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 24
    },
    {
        "wID": 30,
        "wItemId": 12079,
        "szName": "Siberian Husky",
        "dwMoney": 399,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 25
    },
    {
        "wID": 93,
        "wItemId": 8864,
        "szName": "Pendatron's Shadow",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 26
    },
    {
        "wID": 94,
        "wItemId": 30206,
        "szName": "White Majestic Horse",
        "dwMoney": 299,
        "bCount": 1,
        "bCategory": 7,
        "wOrder": 27
    },
    {
        "wID": 50,
        "wItemId": 30134,
        "szName": "Will to Live",
        "dwMoney": 19,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 1
    },
    {
        "wID": 52,
        "wItemId": 30136,
        "szName": "Mighty Will to Live",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 2
    },
    {
        "wID": 51,
        "wItemId": 30135,
        "szName": "Strong Will to Live",
        "dwMoney": 59,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 3
    },
    {
        "wID": 53,
        "wItemId": 11635,
        "szName": "Miracle Powder",
        "dwMoney": 39,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 4
    },
    {
        "wID": 54,
        "wItemId": 15126,
        "szName": "Honourable Protection (30 Days)",
        "dwMoney": 89,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 5
    },
    {
        "wID": 55,
        "wItemId": 30129,
        "szName": "Guardian Angel (7 Days)",
        "dwMoney": 89,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 6
    },
    {
        "wID": 56,
        "wItemId": 30137,
        "szName": "Small Experience Blessing",
        "dwMoney": 9,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 7
    },
    {
        "wID": 57,
        "wItemId": 30138,
        "szName": "Medium Experience Blessing",
        "dwMoney": 19,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 8
    },
    {
        "wID": 58,
        "wItemId": 30139,
        "szName": "Large Experience Blessing",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 9
    },
    {
        "wID": 59,
        "wItemId": 30139,
        "szName": "50x Large Experience Blessing",
        "dwMoney": 1100,
        "bCount": 50,
        "bCategory": 8,
        "wOrder": 10
    },
    {
        "wID": 60,
        "wItemId": 30139,
        "szName": "100x Large Experience Blessing",
        "dwMoney": 2000,
        "bCount": 100,
        "bCategory": 8,
        "wOrder": 11
    },
    {
        "wID": 61,
        "wItemId": 17028,
        "szName": "Companion Dressage Potion",
        "dwMoney": 59,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 14
    },
    {
        "wID": 62,
        "wItemId": 30112,
        "szName": "Change Hairstyle (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 1
    },
    {
        "wID": 63,
        "wItemId": 30113,
        "szName": "Hair Dye (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 2
    },
    {
        "wID": 64,
        "wItemId": 30114,
        "szName": "Potion of Race Alteration (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 3
    },
    {
        "wID": 65,
        "wItemId": 30115,
        "szName": "Potion of Gender Alteration (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 4
    },
    {
        "wID": 66,
        "wItemId": 30116,
        "szName": "Name Change",
        "dwMoney": 69,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 5
    },
    {
        "wID": 67,
        "wItemId": 30117,
        "szName": "Guild renaming",
        "dwMoney": 139,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 6
    },
    {
        "wID": 68,
        "wItemId": 8420,
        "szName": "Scroll of Mutation",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 7
    },
    {
        "wID": 69,
        "wItemId": 7734,
        "szName": "5x Change Hairstyle",
        "dwMoney": 49,
        "bCount": 5,
        "bCategory": 10,
        "wOrder": 8
    },
    {
        "wID": 70,
        "wItemId": 7897,
        "szName": "5x Hair Color",
        "dwMoney": 49,
        "bCount": 5,
        "bCategory": 10,
        "wOrder": 9
    },
    {
        "wID": 71,
        "wItemId": 7622,
        "szName": "5x Potion of Race Alteration",
        "dwMoney": 29,
        "bCount": 5,
        "bCategory": 10,
        "wOrder": 10
    },
    {
        "wID": 72,
        "wItemId": 7623,
        "szName": "Potion of Gender Alteration",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 10,
        "wOrder": 11
    },
    {
        "wID": 73,
        "wItemId": 11916,
        "szName": "Race - Human",
        "dwMoney": 119,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 1
    },
    {
        "wID": 74,
        "wItemId": 11917,
        "szName": "Race - Feline",
        "dwMoney": 119,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 2
    },
    {
        "wID": 75,
        "wItemId": 11918,
        "szName": "Race - Fairy",
        "dwMoney": 119,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 3
    },
    {
        "wID": 76,
        "wItemId": 11967,
        "szName": "Servants Uniform",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 4
    },
    {
        "wID": 77,
        "wItemId": 11968,
        "szName": "Aristocrat Dress",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 5
    },
    {
        "wID": 78,
        "wItemId": 11969,
        "szName": "Festive Dress",
        "dwMoney": 149,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 6
    },
    {
        "wID": 79,
        "wItemId": 11913,
        "szName": "Guy Fawkes Mask",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 7
    },
    {
        "wID": 80,
        "wItemId": 11905,
        "szName": "Bat Mask",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 8
    },
    {
        "wID": 81,
        "wItemId": 11906,
        "szName": "Dark Mask",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 9
    },
    {
        "wID": 82,
        "wItemId": 11914,
        "szName": "Breathing Mask",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 10
    },
    {
        "wID": 83,
        "wItemId": 11915,
        "szName": "Servants Equipment",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 11
    },
    {
        "wID": 84,
        "wItemId": 11908,
        "szName": "Sunglasses",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 12
    },
    {
        "wID": 85,
        "wItemId": 11910,
        "szName": "Monocle",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 13
    },
    {
        "wID": 86,
        "wItemId": 11911,
        "szName": "Horn-rimmed Glasses",
        "dwMoney": 99,
        "bCount": 1,
        "bCategory": 11,
        "wOrder": 14
    },
    {
        "wID": 100,
        "wItemId": 21500,
        "szName": "Rank Boost 50%",
        "dwMoney": 19,
        "bCount": 1,
        "bCategory": 12,
        "wOrder": 4
    },
    {
        "wID": 101,
        "wItemId": 21501,
        "szName": "Rank Boost 75%",
        "dwMoney": 29,
        "bCount": 1,
        "bCategory": 12,
        "wOrder": 5
    },
    {
        "wID": 102,
        "wItemId": 12,
        "szName": "All-purpose Bag",
        "dwMoney": 69,
        "bCount": 1,
        "bCategory": 12,
        "wOrder": 6
    },
    {
        "wID": 103,
        "wItemId": 12,
        "szName": "5x All-purpose Bag",
        "dwMoney": 279,
        "bCount": 5,
        "bCategory": 12,
        "wOrder": 7
    },
    {
        "wID": 104,
        "wItemId": 21505,
        "szName": "Worldwide Remote Shop (30 Days)",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 12,
        "wOrder": 8
    },
    {
        "wID": 154,
        "wItemId": 7723,
        "szName": "Resurrection Scroll",
        "dwMoney": 49,
        "bCount": 10,
        "bCategory": 12,
        "wOrder": 9
    },
    {
        "wID": 105,
        "wItemId": 25039,
        "szName": "Hooded Cloak",
        "dwMoney": 189,
        "bCount": 1,
        "bCategory": 13,
        "wOrder": 1
    },
    {
        "wID": 106,
        "wItemId": 31398,
        "szName": "Derion's Lord Cloak",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 13,
        "wOrder": 2
    },
    {
        "wID": 107,
        "wItemId": 31397,
        "szName": "Valorian's Lord Cloak",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 13,
        "wOrder": 3
    },
    {
        "wID": 108,
        "wItemId": 31399,
        "szName": "Mercenary's Cloak",
        "dwMoney": 249,
        "bCount": 1,
        "bCategory": 13,
        "wOrder": 4
    },
    {
        "wID": 180,
        "wItemId": 17029,
        "szName": "Companion Fortune Potion",
        "dwMoney": 59,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 13
    },
    {
        "wID": 181,
        "wItemId": 17030,
        "szName": "Companion Protection Potion",
        "dwMoney": 59,
        "bCount": 1,
        "bCategory": 8,
        "wOrder": 12
    },
];

// Combined data structure matching API response format
export const cashShopData = {
  categories: {
    success: true,
    items: cashShopCategories
  },
  items: {
    success: true,
    items: cashShopItems
  }
};

// Helper function to get items by category
export const getItemsByCategory = (categoryId: number): CashShopItem[] => {
  return cashShopItems.filter(item => item.bCategory === categoryId);
};

// Helper function to get category by ID
export const getCategoryById = (categoryId: number): CashShopCategory | undefined => {
  return cashShopCategories.find(category => category.bID === categoryId);
};

// Helper function to search items by name
export const searchItems = (searchTerm: string): CashShopItem[] => {
  return cashShopItems.filter(item => 
    item.szName.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
