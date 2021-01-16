/**
 * 
 */
//1. stok miktari 500 üzeri olan baliklarin isimlari
const fishNameOfRequestedValume = new Function('pSearchedValue',
    'return fishFarm.filter(item=>item.stockVolumeInKg > pSearchedValue).map(item=>item.fishType)');


//2. Fiyat aralığı 9fr ile 12 fr olan balıklar
const fishFarmPriceInterwal = new Function('pMinPrice', 'pMaxPrice',
    'return fishFarm.filter(item=>item.price > pMinPrice).filter(item=>item.price < pMaxPrice).map(item=>item.fishType)');


//3.Sadece Bern'de ve Kış sezonu satılan balıklar hangileridir
const fishFarmSaleLocationAndSeason = new Function('pLocation', 'pSeason',
    'return fishFarm.filter(item=>item.season === pSeason).filter(item=>item.saleLocations.includes(pLocation)).map(item=>item.fishType)');


//4.Son Kullanma tarihine göre balıkları sıralayınız. Son kullanma tarihi önce olan balıklar önce
const fishTypeSortByExpirationDate = objectList => {

    objectList.sort(function (pEntryFirst, pEntrySecond) {
        let dateFirst = new Date();
        dateFirst.setTime(pEntryFirst.entryDate.getTime() + (pEntryFirst.durationInDays * 24 * 60 * 60 * 1000));

        let dateSecond = new Date();
        dateSecond.setTime(pEntrySecond.entryDate.getTime() + (pEntrySecond.durationInDays * 24 * 60 * 60 * 1000));

        return dateFirst - dateSecond; //sort by date ascending
    });

    let fishNameList = [...new Set(objectList.map(item => item.fishType))];

    return fishNameList;
}

//5.AB'den gelen ve fiyatı 10Fr dan dusuk olan balıkları alfabetik sıraya göre sıralayınız
const fishTypeEuOriginAndLessPriceAlpeOrd = (pPrice, pList, pObjectList) => {

    let pListVariation = pList.map(name => name.toUpperCase());
    pListVariation = pListVariation.concat(pList);

    let tempObjectList = pObjectList.filter(item => item.price < pPrice);
    tempObjectList = tempObjectList.filter(item => pListVariation.includes(item.originCountry));
    let fishNameList = [...new Set(tempObjectList.map(item => item.fishType))];
    return fishNameList.sort();
}

//6. Toplam Balık Stoku
const sumOfStocks = (pObjectList) => {
    return pObjectList.reduce((sum, current) => sum + current.stockVolumeInKg, 0);
}

//7. En pahalı olan balık hangisi
const maxPriceOfFish = pObjectList => {

    let uniquePrice = [...new Set(pObjectList.map(item => item.price))];
    let tempObjectList = pObjectList.filter(item => item.price === Math.max(...uniquePrice));
    return tempObjectList.map(item => item.fishType);
}

//8. En uzun sureli durabilen baliklar hangi ulkeden gelmektedir?
const maxDurationFishOriginCountry = pObjectList => {

    let uniqueDurationInDays = [...new Set(pObjectList.map(item => item.durationInDays))];
    let maxValue = Math.max(...uniqueDurationInDays);
    let tempObjectList = pObjectList.filter(item => item.durationInDays === maxValue);
    return tempObjectList.map(item => item.originCountry);
}

//9. Kis ve sonbahar sezonu icin swiss romande region'da satilan baliklarin ortalama fiyati nedir?
function checkList(pList1, pList2) {
    return pList1.some(item => pList2.includes(item));
}

const twoSeasonRegionalPriceMedian = (pFirstSeason, pSecondSeason, pRegionList, pObjectList) => {
    let tempObjectList = pObjectList.filter(item => item.season === pFirstSeason);
    let tempObjectListHO = pObjectList.filter(item => item.season === pSecondSeason);
    tempObjectList = tempObjectList.filter(item => (checkList(item.saleLocations, pRegionList)));
    tempObjectListHO = tempObjectListHO.filter(item => (checkList(item.saleLocations, pRegionList)));
    let tempLast = tempObjectList.concat(tempObjectListHO);

    return (tempLast.reduce((sum, current) => sum + current.price, 0)) / tempLast.length;
}

//10. Ticino Kantonu icin stokta toplam ne kadar balik mevcuttur?
const cantonStokTotal = (cantonName, pObjectList) => {

    let tempObjectList = pObjectList.filter(item => item.saleLocations.includes(cantonName));
    let sum = 0;
    let sharedStock;
    for (let index = 0; index < tempObjectList.length; index++) {
        sharedStock = 0;
        sharedStock = tempObjectList[index].stockVolumeInKg / tempObjectList[index].saleLocations.length;
        sum += sharedStock;
    }
    return sum;
}

// 11. Yazlik sezonda cikan ve AB disindan gelen ve de ZH'de satilan baliklarin ortalama gramajini bulunuz?
const seasonalNotEUOriginCantonBaseitemWeightMedian = (pSeason, pCountryList, pCantonName, pObjectList) => {

    let pListVariation = pCountryList.map(name => name.toUpperCase());
    pListVariation = pListVariation.concat(pCountryList);
    let tempObjectList = pObjectList.filter(item => item.season === pSeason);
    tempObjectList = tempObjectList.filter(item => !pListVariation.includes(item.originCountry));
    tempObjectList = tempObjectList.filter(item => item.saleLocations.includes(pCantonName));

    return (tempObjectList.reduce((sum, current) => sum + current.itemWeightInGrams, 0)) / tempObjectList.length;

}