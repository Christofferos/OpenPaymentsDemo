/* ## Imports / Dependencies ## */
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async");
const fetch = require("node-fetch");
let global = require("../globals");

/*
  -
  - Backend API logic defined in this folder. Endpoints defined in the "routes" folder. 
  -
*/

// @desc    Add item to cart
// @route   POST /cart/addSelectedItem/:id
// @access  PUBLIC
exports.addSelectedItem = asyncHandler(async (req, res) => {
  storeProducts[req.params.id].count = 1;
  storeProducts[req.params.id].total = storeProducts[req.params.id].count * storeProducts[req.params.id].price;
  storeProducts[req.params.id].inCart = true;
  let item = await storeProducts[req.params.id];
  let itemCost = await storeProducts[req.params.id].price;

  if (!("cart" in req.session)) {
    req.session.cart = await [];
    req.session.totalCost = await 0;
  }
  await req.session.cart.push(item);
  req.session.totalCost += await itemCost;
  console.log(`Item with index ${req.params.id} was added to the user session.`.yellow);

  await res.json({
    status: "Success",
  });
});

// @desc    Delete item from cart
// @route   POST /cart/deleteSelectedItem/:id
// @access  PUBLIC
exports.deleteSelectedItem = asyncHandler(async (req, res) => {
  if ("cart" in req.session) {
    req.session.cart = await req.session.cart.filter((item) => {
      console.log(item.id - 1);
      console.log(req.params.id);
      item.id - 1 !== req.params.id;
    });
    req.session.totalCost = 0;
    req.session.cart.map((item) => (req.session.totalCost += item.price * item.count));
  }
  await res.json({
    status: "Success",
  });
});

// @desc    Delete all items from cart
// @route   POST /cart/deleteAllItems
// @access  PUBLIC
exports.deleteAllItems = asyncHandler(async (req, res) => {
  if ("cart" in req.session) {
    req.session.cart = await [];
    req.session.totalCost = await 0;
  }
  await res.json({
    status: "Success",
  });
});

// @desc    Increment amount of an item
// @route   POST /cart/incrementSelectedItem/:id
// @access  PUBLIC
exports.incrementSelectedItem = asyncHandler(async (req, res) => {
  if ("cart" in req.session) {
    await req.session.cart[req.params.id].count++;
    req.session.totalCost += await req.session.cart[req.params.id].price;
  }
  await res.json({
    status: "Success",
  });
});

// @desc    Decrement amount of an item
// @route   POST /cart/decrementSelectedItem/:id
// @access  PUBLIC
exports.decrementSelectedItem = asyncHandler(async (req, res) => {
  if ("cart" in req.session) {
    if (req.session.cart[req.params.id] === 1 || req.session.cart[req.params.id] === "1") {
      req.session.cart = await req.session.cart.filter((item) => item.id - 1 !== req.params.id);
      req.session.totalCost = 0;
      await req.session.cart.map((item) => (req.session.totalCost += item.price * item.count));
    } else {
      req.session.cart[req.params.id].count--;
      req.session.totalCost -= await req.session.cart[req.params.id].price;
    }
  }
  await res.json({
    status: "Success",
  });
});

const storeProducts = [
  {
    id: 1,
    title: "LG G7 ThinQ - Black",
    img: "img/LG-G7-thinq.png",
    price: 3620,
    company: "LG Electronics",
    info:
      "LG Electronics Inc. is a South Korean multinational electronics company. The introduction of the G7 ThinQ model was scheduled for other a 2 May 2018 media briefing. In 2014 global sales reached $55.91 billion. LG comprises four business units: Home Entertainment, Mobile Communications, Home Appliances & Air Solutions, and Vehicle Components. Product slogans: `We put people first`, `Digitally Yours`, `Life's Good`. (Wiki) ",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 2,
    title: "Huawei P20 Pro - Blue",
    img: "img/huawei.png",
    price: 4300,
    company: "HUAWEI",
    info:
      "Huawei Technologies Co was founded in 1987. Initially focused on manufacturing phone switches, Huawei has expanded its business to include building telecommunications networks, providing operational and consulting services and equipment to enterprises inside and outside of China, and manufacturing communications devices for the consumer market. Huawei has over 194,000 employees as of December 2019. (Wiki)",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 3,
    title: "Oneplus 7 - Black",
    img: "img/oneplus6.png",
    price: 6799,
    company: "Oneplus",
    info:
      "The OnePlus 7 Pro features a curved edge-to-edge 6.67 19.5:9 FLUID AMOLED display with a 3K resolution (3120×1440 pixels) and 90 Hz refresh rate. It is available in 6 GB RAM with 128 GB of internal storage, or 8 GB RAM with 128 or 256 GB of internal storage. One Plus Technology Co. is a Chinese smartphone manufacturer. The company officially serves 34 countries and regions around the world as of July 2018. They have released numerous phones, amongst other products. (Wiki) ",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 4,
    title: "HTC U12+ - Black",
    img: "img/HTC-U12.png",
    price: 5567,
    company: "htc",
    info:
      "HTC Corporation is a Taiwanese consumer electronics company founded in 1997. In 2016, HTC began to diversify its business beyond smartphones, having partnered with Valve to produce a virtual reality platform known as HTC Vive. After having collaborated with Google on its Pixel smartphone, HTC sold roughly half of its design and research talent, as well as non-exclusive rights to smartphone-related intellectual property, to Google in 2017 for US$1.1 billion. (Wiki)",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 5,
    title: "HTC Desire - Orange",
    img: "img/product-5.png",
    price: 3538,
    company: "htc",
    info:
      "HTC Corporation is a Taiwanese consumer electronics company founded in 1997. In 2016, HTC began to diversify its business beyond smartphones, having partnered with Valve to produce a virtual reality platform known as HTC Vive. After having collaborated with Google on its Pixel smartphone, HTC sold roughly half of its design and research talent, as well as non-exclusive rights to smartphone-related intellectual property, to Google in 2017 for US$1.1 billion. (Wiki)",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 6,
    title: "Iphone 11 - Green ",
    img: "img/iphone11.png",
    price: 11490,
    company: "Apple",
    info:
      "Apple Inc. is an American multinational technology company headquartered in Cupertino, California. It is considered one of the Big Tech technology companies, alongside Amazon, Google, Microsoft and Facebook. The iPhone 11 features the same Liquid Retina LCD display used in 2018's iPhone XR. Overall, the iPhone 11 retains the same glass and aluminum design as the iPhone XR while adding in new features such as the addition of an Ultra-Wide 12mp camera, a battery that lasts 1 hour longer than the iPhone XR and an IP68 rating for water and dust resistance. (Wiki)",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 7,
    title: "Galaxy 8 - Silver",
    img: "img/Samsung-Galaxy-8.png",
    price: 5720,
    company: "Samsung",
    info:
      "Samsung is a South Korean multinational conglomerate headquartered in Samsung Town, Seoul. Samsung was founded in 1938. In 2015, Samsung has been granted more U.S. patents than any other company – including IBM, Google, Sony, Microsoft and Apple. The company received 7,679 utility patents through 11 December. In 2018, Samsung launched the worlds largest mobile manufacturing facility in Noida, India with guest of honour including Indian Prime Minister Narendra Modi. (Wiki)",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },
  {
    id: 8,
    title: "Mi Mix Alpha - Blue",
    img: "img/Mi-Mix-Alpha.png",
    price: 7499,
    company: "Xiaomi",
    info:
      "Xiaomi Corporation is a Chinese electronics company founded in April 2010 and headquartered in Beijing. Xiaomi makes and invests in smartphones, mobile apps, laptops, bags, earphones, shoes, fitness bands, and many other products. Xiaomi is also the fourth company after Apple, Samsung and Huawei to have self-developed mobile phone chip capabilities. Xiaomi has 16,700 employees worldwide. (Wiki) ",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Smartphone",
  },

  // LAPTOPS
  {
    id: 9,
    title: "Komplett Khameleon",
    img: "img/komplettKhameleon.png",
    price: 22999,
    company: "Komplett",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 10,
    title: "MSI GS66 Stealth",
    img: "img/MsiGS66Stealth.png",
    price: 38990,
    company: "MSI",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 11,
    title: "Razer Blade15",
    img: "img/RazerBlade15.png",
    price: 34990,
    company: "Razer",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 12,
    title: "Huawei MateBook",
    img: "img/HuaweiMateBook.png",
    price: 18990,
    company: "Huawei",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 13,
    title: "Acer Predator Triton",
    img: "img/AcerPredatorTriton.png",
    price: 16790,
    company: "Acer",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 14,
    title: "Asus Rog Zephyrus",
    img: "img/AsusRogZephyrus.png",
    price: 45990,
    company: "Asus",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 15,
    title: "Asus Zen Book",
    img: "img/AsusZenBookPro.png",
    price: 37990,
    company: "Asus",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },
  {
    id: 16,
    title: "Dell XPS15",
    img: "img/DellXPS15.png",
    price: 21990,
    company: "Dell",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Laptop",
  },

  // Gaming
  {
    id: 17,
    title: "Komplett Twin Titan",
    img: "img/komplettTwinTitan.png",
    price: 99999,
    company: "Komplett",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 18,
    title: "Xbox Series X",
    img: "img/XboxX.png",
    price: 5000,
    company: "Microsoft",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 19,
    title: "Playstation 5",
    img: "img/playstation5.png",
    price: 10000,
    company: "Sony",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 20,
    title: "Arozzi VeronaV2",
    img: "img/ArozziVeronaV2.png",
    price: 2495,
    company: "Arozzi",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 21,
    title: "Hunter Spider V3",
    img: "img/hunterSpiderV3.png",
    price: 400,
    company: "Hunter",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 22,
    title: "Logitech G432",
    img: "img/LogitechG432.png",
    price: 550,
    company: "Logitech",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 23,
    title: "Elgato Wave1",
    img: "img/ElgatoWave1.png",
    price: 1700,
    company: "Elgato",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
  {
    id: 24,
    title: "Airpods",
    img: "img/airpods.png",
    price: 1428,
    company: "Apple",
    info: "",
    inCart: false,
    count: 0,
    total: 0,
    productType: "Gaming",
  },
];
