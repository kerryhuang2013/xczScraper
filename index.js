const puppeteer = require('puppeteer');
const CIPAI_URL = 'http://lib.xcz.im/nav-cipai';
const initData = require('./models/init/initData.js');
const POETRY_URL = 'http://lib.xcz.im/nav-poetry';
const Cipai = require('./models/cipai.js');
const Zuopin = require('./models/zuopin.js');
const Zuozhe = require('./models/zuozhe.js');
const CIPAI_LIST_SELECTOR = 'div.cipai-container>ul>li>a';
const ZUOPIN_PAGE_SELECTOR = 'span.curent>input';
const FANHUI_SELECTOR = 'div.page-changer>div';
const GET_ALL_WORKS_API = 'getWorksAllIncludeCount';
const GET_ZUOZHE_API = 'getAuthorById2';


//抓取词牌名
async function scrapeCipai(page) {
  await page.goto(CIPAI_URL);
  var cipais = await page.$$eval(CIPAI_LIST_SELECTOR, items => items.map(item => item.innerHTML));
  cipais.forEach((cipaiName) => {
    var cipai = new Cipai({name: cipaiName});
    cipai.save((err) => {if (err) console.log(err)});
  }); 
  return cipais;
};

//从response抓取作品
async function scrapeZuopin(request) {
  if (request.url().endsWith(GET_ALL_WORKS_API) && request.method() == "POST") {
    resJson = await request.response().json();
    zuopins = resJson.result.works;
    zuopins.forEach((item) => {
      zuopin = new Zuopin({
        timu: item.title,
        cipai: item.kindCN=='词' ? item.title.split('·',1) : null,
        zuozhe: item.authorName,
        leixing: item.kindCN,
        chaodai: item.dynasty,
        baiduwiki: item.baiduWiki,
        fanyi: item.translation,
        pingxi: item.intro,
        shangxi: item.appreciation,
        neirong: item.content,  
        jiping: item.masterComment,
        qianyan: item.foreword,
        zhushi: item.annotation,
        zuozheId: item.authorId,
        refId: item.workId
      });
      zuopin.save((err) => {if (err) console.log(err)});
    });
  };
};

//从response抓取作者
async function scrapeZuozhe(request) {
  if (request.url().endsWith(GET_ZUOZHE_API)) {
    resJson = await request.response().json();
    zuozheRes = resJson.result;
    zuozhe = new Zuozhe({
      name: zuozheRes.name,
      shengnian: zuozheRes.birthYear,
      zunian: zuozheRes.deathYear,
      chaodai: zuozheRes.dynasty,
      baiduWiki: zuozheRes.baiduWiki,
      jianjie: zuozheRes.desc,
      zuopinCount: zuozheRes.worksCount,
      shiCount: zuozheRes.worksShiCount,
      ciCount: zuozheRes.worksCiCount,
      quCount: zuozheRes.worksQuCount,
      fuCount: zuozheRes.worksFuCount,
      wenCount: zuozheRes.worksWenCount,
      refId: zuozheRes.authorId
    });
    zuozhe.save((err) => {if (err) console.log(err.errmsg)});
  }
};

//通过作品页面遍历作者
async function naviZuozhePage(page, zuozheNames) {
  var n = 2;
  while (n <= 21) {
    let elZuozhe = await page.$(`div.left>div.sons:nth-child(${n})>div.cont>p.source`);
    if (elZuozhe) {
      let zuozhe = await elZuozhe.$$eval('*', items => items.map(item => item.innerHTML));
      let zuozheName = zuozhe.join('');
      if (zuozheNames.indexOf(zuozheName) == -1) {
        zuozheNames.push(zuozheName);
        await elZuozhe.click();
        await page.waitFor(1000);
        let elFanhui = await page.$(FANHUI_SELECTOR);
        if (elFanhui) await elFanhui.click();
      }     
    }
    n++; 
  };
}


async function scrapeXCZ() {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

  //初始化数据
  //initData();  

  //从页面上抓取词牌名
  //scrapeCipai(page);

  //分页抓取作品
  //page.on('requestfinished', scrapeZuopin);
  page.on('requestfinished', scrapeZuozhe);
  await page.goto(POETRY_URL);
  await page.waitFor(500);
  zuozheNames = [];
  await naviZuozhePage(page, zuozheNames);

  for (i=26493;i<=26599;i++) {
    console.log(`Navigating page ${i} ...`);
    await page.focus(ZUOPIN_PAGE_SELECTOR);
    await page.keyboard.down('ControlLeft');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('ControlLeft');
    await page.type(ZUOPIN_PAGE_SELECTOR,i.toString());
    await page.keyboard.press('Tab');
    await page.waitFor(2000);
    await naviZuozhePage(page, zuozheNames);
  };
  //page.removeListener('requestfinished', scrapeZuopin);
  page.removeListener('requestfinished', scrapeZuozhe);
  
  browser.close();
};

scrapeXCZ();