'use strict';
const searchUrlEtherscan = 'https://api.etherscan.io/api?';
const searchUrlSimplehash = 'https://api.simplehash.com/api/v0/nfts/owners?chains=ethereum,polygon&';
const searchUrlPolygonscan = 'https://api.polygonscan.com/api?';
const apikey = 'RVEY7NDNGY5NGXDG7BNITNGG1KQJBYWNEH';
const apikeyPolygonscan = 'E1JJP7DRZY94WDR146W8SIR8W888YRGTSR';
var txArray = [];
var dateArray = [];
function addData(data) {
  if (data >= 850) {
    config.data.datasets.forEach(dataset => dataset.value.push(850));
  }
  else {
    config.data.datasets.forEach(dataset => dataset.value.push(data));
  }
  window.myGauge.update();
}
function reduce(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
function sortDates(arr) {
  return arr.sort((a, b) => (a > b) - (a < b));
}
function getEnsData(query) {
  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "jgrinnell0_sk_82c9299c-2e9b-4bf4-b826-6f972e678a22_8ew0pamll0470zzn");
  var requestOptions = {
    headers: myHeaders,
  };
  const params2 = {
    wallet_addresses: query,
    count: '1',
    contract_addresses: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
  };
  const queryString = formatQueryParams(params2);
  const url2 = searchUrlSimplehash + queryString;
  fetch(url2, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderNFTs(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function getCryptoUchallengeData(query) {
  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "jgrinnell0_sk_82c9299c-2e9b-4bf4-b826-6f972e678a22_8ew0pamll0470zzn");
  var requestOptions = {
    headers: myHeaders,
  };
  const params3 = {
    wallet_addresses: query,
    count: '1',
    contract_addresses: '0x13ff6a9922DAF2E2820Ba5Dd5C7153890B197fcb'
  };
  const queryString = formatQueryParams(params3);
  const url3 = searchUrlSimplehash + queryString;
  fetch(url3, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderCryptoU(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function formatTimestamp(ts) {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var convertUnix = new Date(ts * 1000);
  return monthNames[convertUnix.getMonth()] + ' ' + convertUnix.getDate() + ', ' + convertUnix.getFullYear();
}
function getNumberOfDays(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays;
}
function displayResults(responseJson) {
  if (responseJson.status == 0) {
    txArray.push(0);
    console.log(`empty eth tx`)
  }
  else {
    // $('#score').empty();
    var firstTx = responseJson.result[0].timeStamp;
    var lastTx = responseJson.result[responseJson.result.length - 1].timeStamp;
    txArray.push(responseJson.result.length);
    dateArray.push(firstTx, lastTx);
    console.log(txArray);
    console.log(dateArray);
    for (let i = 0; i < responseJson.result.length; i++) {
      if (responseJson.result.length > 0 && responseJson.result[i].isError == 0) {
        $('#tr').empty().append(`<div class="complete">Complete</div><div><a target="blank" href="https://etherscan.io/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></div>`);
        $('#checkbox1').prop('checked', true);
        $('#transact').addClass('hidden');
        $('#teachTransact').removeClass('hidden');
      }
      if (responseJson.result[i].functionName.includes('swap') || responseJson.result[i].functionName.includes('proxiedSwap')) {
        $('#sw').empty().append(`<div class="complete">Complete</div><div><a target="blank" href="https://etherscan.io/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></div>`);
        $('#checkbox2').prop('checked', true);
        $('#swap').addClass('hidden');
        $('#teachSwap').removeClass('hidden');
      }
      if (bridgeArray.indexOf(responseJson.result[i].to) !== -1) {
        $('#br').empty().append(`<div class="complete">Complete</div><div><a target="blank" href="https://etherscan.io/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></div>`);
        $('#checkbox3').prop('checked', true);
        $('#polygon').addClass('hidden');
        $('#teachBridge').removeClass('hidden');
      }
      if (lendBorrowEarn.indexOf(responseJson.result[i].to) !== -1) {
        $('#checkbox4').prop('checked', true);
        $('#le').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="https://etherscan.io/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></span>`);
        $('#aave').addClass('hidden');
        $('#teachDefi').removeClass('hidden');
      }
    }
  }
};
function displayPolygonResults(responseJson) {
  if (responseJson.status == 0) {
    txArray.push(0);
    console.log(`empty polygon tx`)
  }
  else {
    // $('#score').empty();
    var firstTx = responseJson.result[0].timeStamp;
    var lastTx = responseJson.result[responseJson.result.length - 1].timeStamp;
    txArray.push(responseJson.result.length);
    dateArray.push(firstTx, lastTx);
    console.log(txArray);
    console.log(dateArray);
    for (let i = 0; i < responseJson.result.length; i++) {
      if (responseJson.result.length > 0 && responseJson.result[i].isError == 0) {
        $('#tr').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="https://polygonscan.com/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></span>`);
        $('#checkbox1').prop('checked', true);
        $('#transact').addClass('hidden');
        $('#teachTransact').removeClass('hidden');
      }
      if (responseJson.result[i].functionName.includes('swap') || responseJson.result[i].functionName.includes('proxiedSwap')) {
        $('#sw').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="https://polygonscan.com/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></span>`);
        $('#checkbox2').prop('checked', true);
        $('#swap').addClass('hidden')
        $('#teachSwap').removeClass('hidden');
      }
      if (bridgeArray.indexOf(responseJson.result[i].to) !== -1) {
        $('#br').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="https://polygonscan.com/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></span>`);
        $('#checkbox3').prop('checked', true);
        $('#polygon').addClass('hidden');
        $('#teachBridge').removeClass('hidden');
      }
      if (lendBorrowEarn.indexOf(responseJson.result[i].to) !== -1) {
        $('#checkbox4').prop('checked', true);
        $('#le').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="https://polygonscan.com/tx/${responseJson.result[i].hash}"><img class="t" src="link.png"></a></span>`);
        $('#aave').addClass('hidden');
        $('#teachDefi').removeClass('hidden');
      }
      ;
    }
  }
};
function getTxDataEtherscan(query) {
  const params = {
    address: query,
    module: 'account',
    action: 'txlist',
    apikey: apikey,
    sort: 'desc'
  };
  const queryString = formatQueryParams(params)
  const url = searchUrlEtherscan + queryString
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function getTxDataPolygon(query) {
  const params = {
    address: query,
    module: 'account',
    action: 'txlist',
    apikey: apikeyPolygonscan,
    sort: 'desc'
  };
  const queryString = formatQueryParams(params);
  const urlPolygon = searchUrlPolygonscan + queryString;
  fetch(urlPolygon)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayPolygonResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $(".subtitle").addClass('hidden');
    $('#form-parent').addClass('hidden');
    $('.header').addClass('hidden');
    $('#js-error-message').empty();
    const account1 = $('#js-search-term').val();
    const account2 = $('#js-search-term2').val();
    const account3 = $('#js-search-term3').val();
    if (account1 !== account2 && account1 !== account3 && account1.length > 0) {
      getTxDataEtherscan(account1);
      getTxDataPolygon(account1);
      getEnsData(account1);
      getCryptoUchallengeData(account1);
      const parsedAccount1 = '0x...' + account1.substring(account1.length - 5);
      $('#addresses').append(
        `<a target="blank" href="https://etherscan.io/address/${account1}">${parsedAccount1}</a><br>`)
    }
    else if (account1 === account2 && account1.length > 0) {
      return $('#js-error-message').append(`can't submit duplicate accounts to pad your score, anon`);
    }
    if (account2 !== account1 && account2 !== account3 && account2.length > 0) {
      getTxDataEtherscan(account2);
      getTxDataPolygon(account2);
      getEnsData(account2);
      getCryptoUchallengeData(account2);
      const parsedAccount2 = '0x...' + account2.substring(account2.length - 5);
      $('#addresses').append(
        `<a target="blank" href="https://etherscan.io/address/${account2}">${parsedAccount2}</a><br>`)
    }
    else if (account2 === account3 && account2.length > 0) {
      return $('#js-error-message').append(`can't submit duplicate accounts to pad your score, anon`);
    }
    if (account3 !== account1 && account3 !== account2 && account3.length > 0) {
      getTxDataEtherscan(account3);
      getTxDataPolygon(account3);
      getEnsData(account3);
      getCryptoUchallengeData(account3);
      const parsedAccount3 = '0x...' + account3.substring(account3.length - 5);
      $('#addresses').append(
        `<a target="blank" href="https://etherscan.io/address/${account3}">${parsedAccount3}</a><br>`)
    }
    else if (account3 === account1 && account3.length > 0) {
      return $('#js-error-message').append(`can't submit duplicate accounts to pad your score, anon`);
    }
    else if (account1.length == 0 && account2.length == 0 && account3.length == 0) {
      return $('#js-error-message').append(`you'll need to submit at least 1 address, anon`);
    }
    $('#js-search-term, #js-search-term2,#js-search-term3').val("");
    txArray.length = 0;
    dateArray.length = 0;
    calcScore();
    waitForFullLoad();
    $('#load').removeClass('hidden')
  });
}
function watchRefresh() {
  $('#refresh').click(event => {
    event.preventDefault();
    location.reload();
  })
}
function watchAbout() {
  $('#about').click(event => {
    event.preventDefault();
    $('#not-about').empty();
    $('#results').empty();
    $('#js-error-message').empty();
    $('#about-text').removeClass('hidden')
  })
}
$(watchForm);
$(watchRefresh);
$(watchAbout);
//remove spaces, prevent ens names (for now)
$(function () {
  $('#js-search-term, #js-search-term2, #js-search-term3').on('keypress', function(e) {
    if (e.which == 32 || e.which == 46)
      return false;
  })
});
function renderNFTs(responseJson) {
  for (let i = 0; i < responseJson.nfts.length; i++) {
    $('#ens').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="${responseJson.nfts[i].collection.marketplace_pages[0].nft_url}"><img class="t" src="link.png"></a></span>`);
    $('#checkbox5').prop('checked', true);
    $('#ens_domore').addClass('hidden');
    $('#teachEns').removeClass('hidden');
  }
}
function renderCryptoU(responseJson) {
  for (let i = 0; i < responseJson.nfts.length; i++) {
    if (responseJson.count >= 1) {
      $('#cu').removeClass('hidden');
      $('#cryptoU').empty().append(`<span class="complete">Complete</span><span><a target="blank" href="${responseJson.nfts[i].collection.marketplace_pages[0].nft_url}"><img class="t" src="link.png"></a></span>`);
      $('#checkbox6').prop('checked', true);
      $('#cryptoU_domore').addClass('hidden');
      $('#teachCryptoU').removeClass('hidden');
    }
  }
}
function waitForFullLoad() {
  setTimeout(() => {
    $('#results').removeClass('hidden').hide().fadeIn(1500);
    $('#load').addClass('hidden');
  }, 4000);
}
function calcScore() {
  setTimeout(() => {
    var taskNum = $(":checkbox:checked").length;
    var totalTx = reduce(txArray);
    console.log(dateArray)
    var dates = sortDates(dateArray);
    console.log(totalTx);
    var mostRecentDate = dates[dates.length - 1];
    var activityPeriod = getNumberOfDays(formatTimestamp(dates[0]), formatTimestamp(mostRecentDate)) + 1;
    var final = Math.ceil((Math.ceil((activityPeriod) / 365) * totalTx).toFixed(1) * taskNum);
    addData(final);
    console.log(final);
    console.log(taskNum);
    $('#statement').empty().append(
      ` <p class="g">You had <span class="spotlight">${totalTx}</span> transactions between <span class="spotlight">${formatTimestamp(dates[0])}<span> — <span class="spotlight">${formatTimestamp(mostRecentDate)}</span> and you completed <span class="spotlight">${taskNum}</span> crypto-forward tasks</p>
          `);
    if (final > 0) {
      $('#final').append(
        `${final}`)
      if (final < 100) {
        $('#l').append(`crypto aware`)
      }
      if (final >= 100 && final < 600) {
        $('#l').append(`crypto competent`);
      }
      if (final >= 600) {
        $('#l').append(`crypto forward`);
      }
    }
  }, 3900);
};
// get all bridge contracts (polygon, optimism, arbitrum, zkSync, hop protocol from https://etherscan.io/accounts/label/bridge?subcatid=undefined&size=100&start=0&col=1&order=asc)
const bridgeArray =
  ['0x8ed95d1746bf1e4dab58d8ed4724f1ef95b20db0', '0x0ac2d6f5f5afc669d3ca38f830dad2b4f238ad3f', '0xa6baaed2053058a3c8f11e0c7a9716304454b09e', '0x96e471b5945373de238963b4e032d3574be4d195', '0x43298f9f91a4545df64748e78a2c777c580573d6', '0x30b44c676a05f1264d1de9cc31db5f2a945186b6', '0xdfe0ec39291e3b60aca122908f86809c9ee64e90', '0x256c8919ce1ab0e33974cf6aa9c71561ef3017b6', '0x02fbb64517e1c6ed69a6faa3abf37db0482f1152', '0x7355efc63ae731f584380a9838292c7046c1e433', '0xbbbd1bbb4f9b936c3604906d7592a644071de884', '0x23122da8c581aa7e0d07a36ff1f16f799650232f', '0xb2535b988dce19f9d71dfb22db6da744acac21bf', '0xc840838bc438d73c16c2f8b22d2ce3669963cd48', '0xe4e2121b479017955be0b175305b35f312330bae', '0xcee284f754e854890e311e3280b767f80797180d', '0xd3b5b60020504bc3489d6949d545893982ba3011', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x72ce9c846789fdb6fc1f34ac4ad25dd9ef7031ef', '0xd92023e9d9911199a6711321d1277285e6d4e2db', '0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a', '0xe5896783a2f463446e1f624e64aa6836be4c6f58', '0xa10c7ce4b876998858b1a9e12b10092229539400', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', '0x667e23abd27e623c11d4cc00ca3ec4d0bd63337a', '0x0b9857ae2d4a3dbe74ffe1d7df045bb7f96e4840', '0x14797f5432f699cb4d4db04df599b74952d78d7b', '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6', '0xdac7bb7ce4ff441a235f08408e632fa1d799a147', '0x8eb8a3b98659cce290402893d0123abb75e3ab28', '0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08', '0x737901bea3eeb88459df9ef1be8ff3ae1b42a2ba', '0xf78765bd14b4e8527d9e4e5c5a5c11a44ad12f47', '0xecad1ab3464eccc7536af6afee414df873495616', '0x841ce48f9446c8e281d3f1444cb859b4a6d0738c', '0xc578cbaf5a411dfa9f0d227f97dadaa4074ad062', '0x5427fefa711eff984124bfbb1ab6fbf5e3da1820', '0xf1c1413096ff2278c3df198a28f8d54e0369cf3a', '0x74af8a878317e0f6e72e302fbcdf5f3009186398', '0x4add6ab943e7908bb51e7878755d0ca322c898d6', '0x3be8a7d4aa3e9b723a718e1b83fe8a8b5c37871c', '0x43de2d77bf8027e25dbd179b491e8d64f38398aa', '0xd54f502e184b6b739d7d27a6410a67dc462d69c8', '0x9280e0ffdfae4ec895fdf4d4978c9e1b869eb774', '0x9a8c4bdcd75cfa1059a6e453ac5ce9d3f5c82a35', '0x6880f6fd960d1581c2730a451a22eed1081cfd72', '0x3014ca10b91cb3d0ad85fef7a3cb95bcac9c0f79', '0x30f938fed5de6e06a9a7cd2ac3517131c317b1e7', '0x75ace7a086ea0fb1a79e43cc6331ad053d8c67cb', '0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016', '0x7e7669bdff02f2ee75b68b91fb81c2b38f9228c2', '0x6ea6c65e14661c0bcab5bc862fe5e7d3b5630c2f', '0x7301cfa0e1756b71869e93d4e4dca5c7d0eb0aa6', '0xa4108aa1ec4967f8b52220a4f7e94a8201f2d906', '0xfd53b1b4af84d59b20bf2c20ca89a6beeaa2c628', '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857', '0x426a61a2127fdd1318ec0edce02474f382fdad30', '0xf9fb1c508ff49f78b60d3a96dea99fa5d7f3a8a6', '0xfe601de9d4295274b9904d5a9ad7069f23ee2b32', '0x4d34e61caf7a3622759d69e48ccdeb8dee5021e8', '0x1bd0029385f95ad2584cdfaf5c19f3f20651def6', '0xe2e3441004e7d377a2d97142e75d465e0dd36af9', '0xa929022c9107643515f5c777ce9a910f0d1e490c', '0x3d4cc8a61c7528fd86c55cfe061a78dcba48edd1', '0xb8901acb165ed027e32754e0ffe830802919727f', '0x22b1cbb8d98a01a3b71d034bb899775a76eb1cc2', '0x3666f603cc164936c1b87e207f36beba4ac5f18a', '0x3e4a3a4796d16c0cd582c382691998f7c06420b6', '0xb98454270065a31d71bf635f6f7ee6a518dfb849', '0x5fdcca53617f4d2b9134b29090c87d01058e27e9', '0x37acfef331e6063c8507c2a69c97b4f78c770a5a', '0x3307c46a1e9633025d2e89658c7502a683585450', '0x5a1d63d3e1303e89503f2a1ecb553328f148909d', '0x50002cdfe7ccb0c41f519c6eb0653158d11cd907', '0xf86fd6735f88d5b6aa709b357ad5be22cedf1a05', '0x66a71dcef29a0ffbdbe3c6a460a3b5bc225cd675', '0x014f808b7d4b6f58be5fef88002d5028cd0ed14b', '0x0baba1ad5be3a5c0a66e7ac838a129bf948f1ea4', '0x674bdf20a0f284d710bc40872100128e2d66bd3f', '0xec3cc6cf0252565b56fc7ac396017df5b9b78a31', '0x3980c9ed79d2c191a89e02fa3529c60ed6e9c04b', '0xc10ef9f491c9b59f936957026020c321651ac078', '0xfc7cc7c7e7985316d23104b9689c511134f59bc8', '0x13b432914a996b0a48695df9b2d701eda45ff264', '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe', '0x87bcb3038988ca2a89605ffa8f237fb78df1c3ae', '0x46290b0c3a234e3d538050d8f34421797532a827', '0xd779967f8b511c5edf39115341b310022900efed', '0x923e0a17f49fb03d936f2af2d59d379c615f5447', '0xec4486a90371c9b66f499ff3936f29f0d5af8b7e', '0x10c6b61dbf44a083aec3780acf769c77be747e23', '0xe4cf417081a0ab3f964b44d904bc2b534351a9a7', '0x533e3c0e6b48010873b947bddc4721b1bdff9648', '0xe95fd76cf16008c12ff3b3a937cb16cd9cc20284', '0x6b7a87899490ece95443e979ca9485cbe7e71522', '0x765277eebeca2e31912c9946eae1021199b39c61', '0xba8da9dcf11b50b03fd5284f164ef5cdef910705', '0x4e67df0f232c3bc985f8a63326d80ce3d9a40400', '0x8cc49fe67a4bd7a15674c4ffd4e969d94304bbbf', '0x57ed6bd35a6ce815079855cd0b21331d1d5d0a0e', '0xcdd83050f045ab31b884f0dc49581bc7b3e0b84c', '0x23ddd3e3692d1861ed57ede224608875809e127f', '0x2d6775c1673d4ce55e1f827a0d53e62c43d1f304', '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3', '0x070cb1270a4b2ba53c81cef89d0fd584ed4f430b', '0x3eed23ea148d356a72ca695dbce2fceb40a32ce0', '0x48d7a6bbc428bca019a560cf3e8ea5364395aad3', '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00', '0x6a39909e805a3eadd2b61fff61147796ca6abb47', '0x4fc16de11deac71e8b2db539d82d93be4b486892', '0x2784a755690453035f32ac5e28c52524d127afe2', '0x10e6593cdda8c58a1d0f14c5164b376352a55f2f', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x1bf68a9d1eaee7826b3593c20a0ca93293cb489a', '0xeec0fb4913119567cdfc0c5fc2bf8f9f9b226c2d', '0xcd38b15a419491c7c1238b0659f65c755792e257', '0x8f92e7353b180937895e0c5937d616e8ea1a2bb9', '0x2140ecdc45c89ca112523637824513bae72c8671', '0x4c36d2919e407f0cc2ee3c993ccf8ac26d9ce64e', '0xa0c68c638235ee32657e8f720a23cec1bfc77c77', '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x8484ef722627bf18ca5ae6bcf031c23e6e922b30', '0x401f6c983ea34274ec46f84d70b31c151321188b', '0xa68d85df56e733a06443306a095646317b5fa633', '0xf687e1481d85f8b9f4d1f4d4c15348cef8e5a762', '0xe4b679400f0f267212d5d812b95f58c83243ee71', '0x32666b64e9fd0f44916e1378efb2cfa3b3b96e80', '0x5d22045daceab03b158031ecb7d9d06fad24609b', '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d', '0xd8b19613723215ef8cc80fc35a1428f8e8826940', '0xf4b00c937b4ec4bb5ac051c3c719036c668a31ec', '0xeae57ce9cc1984f202e15e038b964bb8bdf7229a', '0xf5c9f957705bea56a7e806943f98f7777b995826', '0x659a00c33263d9254fed382de81349426c795bb6', '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419', '0xf6080d9fbeebcd44d89affbfd42f098cbff92816', '0xbb3400f107804dfb482565ff1ec8d8ae66747605', '0x283751a21eafbfcd52297820d27c1f1963d9b5b4', '0x2796317b0ff8538f253012862c06787adfb8ceb6', '0xa2569370a9d4841c9a62fc51269110f2eb7e0171', '0x6571d6be3d8460cf5f7d6711cd9961860029d85f', '0x045e507925d2e05d114534d0810a1abd94aca8d6', '0xcd9d4988c0ae61887b075ba77f08cbfad2b65068', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f', '0xc145990e84155416144c532e31f89b840ca8c2ce', '0x4103c267fba03a1df4fe84bc28092d629fa3f422', '0x86ca49d37015a8541642b1b5a90af0115ec61994', '0xf301d525da003e874df574bcdd309a6bf0535bb6', '0x98f3c9e6e3face36baad05fe09d375ef1464288b', '0x3ee18b2214aff97000d974cf647e7c347e8fa585', '0xf92cd566ea4864356c5491c177a430c222d7e678', '0x31efc4aeaa7c39e54a33fdc3c46ee2bd70ae0a09', '0xe34b087bf3c99e664316a15b01e5295eb3512760', '0x104b9b1c41c6764e88edf1207f498902d840fe2a', '0x0dd1f24cf4ff96f197a795d02d0ba1eb53448bcc', '0x8eca806aecc86ce90da803b080ca4e3a9b8097ad', '0x6de5bdc580f55bc9dacafcb67b91674040a247e3', '0x5cdaf83e077dbac2692b5864ca18b61d67453be8', '0xabea9132b05a70803a4e85094fd0e1800777fbef', '0xc30141b657f4216252dc59af2e7cdb9d8792e1b0']
// compound, yearn, aave, convex
const lendBorrowEarn =
  ['0xe65cdb6479bac1e22340e4e755fae7e509ecd06c', '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4', '0xface851a4921ce59e912d19329929ce6da6eb0c7', '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b', '0xf5dce57282a584d2746faf1593d3121fcac444dc', '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7', '0x12392f67bdf24fae0af363c24ac620a2f67dad86', '0xccf4429db6322d5c611ee964527d42e5d685dd6a', '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946', '0x6d903f6003cca6255d85cca4d3b5e5146dc33925', '0x3fda67f7583380e67ef93072294a7fac882fd7e7', '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e', '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5', '0x1c1853bc7c6bff0d276da53972c0b1a066db1ae7', '0xc00e94cb662c3520282e6f5717214004a7f26888', '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b', '0x316f9708bb98af7da9c68c1c3b5e79039cd336e3', '0xcfc1fa6b7ca982176529899d99af6473ad80df4f', '0xf859a1ad94bcf445a406b892ef0d3082f4174088', '0x158079ee67fce2f58472a96584a73c7ab9ac95c1', '0x35a18000230da775cac24873d00ff85bccded550', '0x39aa39c021dfbae8fac545936693ac917d5e7563', '0x285617313887d43256f852cae0ee4de4b68d45b0', '0x42f9505a376761b180e27a01ba0554244ed1de7d', '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4', '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407', '0xa7ff0d561cd15ed525e31bbe0af3fe34ac2059f6', '0x1449e0687810bddd356ae6dd87789244a46d9adb', '0xcec237e83a080f3225ab1562605ee6dedf5644cc', '0xfe83af639f769ead20bad76067abc120245a06a9', '0xc0da01a04c3f3e0be433606045bb7017a7323e38', '0x1055be4bf7338c7606d9efdcf80593f180ba043e', '0x02557a5e05defeffd4cae6d83ea3d173b272c904', '0xba3d9687cf50fe253cd2e1cfeede1d6787344ed5', '0xe1ba0fb44ccb0d11b80f92f4f8ed94ca3ff51d00', '0x6ee0f7bb50a54ab5253da0667b0dc2ee526c30a8', '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d', '0x9d91be44c06d373a8a226e1f3b146956083803eb', '0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84', '0x6fce4a401b6b80ace52baaefe4421bd188e76f6f', '0x7deb5e830be29f91e298ba5ff1356bb7f8146998', '0x328c4c80bc7aca0834db37e6600a6c49e12da4de', '0x625ae63000f46200499120b906716420bd059240', '0x4da9b813057d04baef4e5800e36083717b4a0341', '0xb124541127a0a657f056d9dd06188c4f1b0e5aab', '0x9ba00d6856a4edf4665bca2c2309936572473b7e', '0x71fc860f7d3a592a4a98740e39db31d25db65ae8', '0xfc4b8ed459e00e5400be803a9bb3954234fd50e3', '0x12e51e77daaa58aa0e9247db7510ea4b46f9bead', '0x6fb0855c404e09c47c3fbca25f08d4e41f9f062f', '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9', '0xa069e33994dcc24928d99f4bbeda83aaef00b5f3', '0x93a62da5a14c80f265dabc077fcee437b1a0efde', '0x29e240cfd7946ba20895a7a02edb25c210f9f324', '0x04bc0ab673d88ae9dbc9da2380cb6b79c4bca9ae', '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c', '0x975f1bc238303593efab00d63cf0fc5f519a8de0', '0xed03415e5705c5abbf8e94c491b715df526cad55', '0x2c3a2558e9b91e893e53bce94de3457a29f6b262', '0x16de59092dae5ccf4a1e6439d611fd0653f0bd01', '0xf61718057901f84c4eec4339ef8f0d86d2b45600', '0x73a052500105205d34daf004eab301916da8190f', '0xd6ad7a6750a7593e092a9b218d66c0a814a3436e', '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e', '0x83f798e925bcd4017eb265844fddabb448f1707d', '0xba2e7fed597fd0e3e70f5130bcdbbfe06bb94fe1', '0x033e52f513f9b98e129381c6708f9faa2dee5db5', '0xb01419e74d8a2abb1bbad82925b19c36c191a701', '0x3a22df48d84957f907e67f4313e3d43179040d6e', '0x0001fb050fe7312791bf6475b96569d83f695c9f', '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', '0x1cc481ce2bd2ec7bf67d1be64d4878b16078f309', '0xbb3bf20822507c70eafdf11c7469c98fc752ccca', '0x96e61422b6a9ba0e068b6c5add4ffabc6a4aae27', '0xdf5e4e54d212f7a01cf94b3986f40933fcff589f', '0x6903223578806940bd3ff0c51f87aa43968424c8', '0x03403154afc09ce8e44c3b185c82c6ad5f86b9ab', '0x46afc2dfbd1ea0c0760cad8262a5838e803a37e5', '0xcb550a6d4c8e3517a939bc79d0c7093eb7cf56b5', '0x0a61c2146a7800bdc278833f21ebf56cd660ee2a', '0xc454f4e1ddb39c8de9663287d52b0e4feb4ca45e', '0x35f5a420ef9bcc748329021fbd4ed0986abdf201', '0x8e6741b456a074f0bc45b8b82a755d4af7e965df', '0x2d407ddb06311396fe14d4b49da5f0471447d45c', '0x710295b5f326c2e47e6dd2e7f6b5b0f7c5ac2f24', '0x7d96ab1f847c3564b8f9a93f35e1027ada74aec2', '0xe15461b18ee31b7379019dc523231c57d1cbc18c', '0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804', '0x0b634a8d61b09820e9f72f79cdcbc8a4d0aad26b', '0xc97232527b62efb0d8ed38cf3ea103a6cca4037e', '0x27b5739e22ad9033bcbf192059122d163b60349d', '0xd0660cd418a64a1d44e9214ad8e459324d8157f1', '0x9ca85572e6a3ebf24dedd195623f188735a5179f', '0xfcc5c47be19d06bf83eb04298b026f81069ff65b', '0x27b7b1ad7288079a66d12350c828d3c00a6f07d7', '0x7047f90229a057c13bf847c0744d646cfb6c9e1a', '0x5533ed0a3b83f70c3c4a1f69ef5546d3d4713e44', '0xb8c3b7a2a618c552c23b1e4701109a9e756bab67', '0xe625f5923303f1ce7a43acfefd11fd12f30dbca4', '0xa8b1cb4ed612ee179bdea16cca6ba596321ae52d', '0x2994529c0652d127b7842094103715ec5299bbed', '0x629c759d1e83efbf63d84eb3868b564d9521c129', '0x98b058b2cbacf5e99bc7012df757ea7cfebd35bc', '0xcc7e70a958917cce67b4b87a8c30e6297451ae98', '0x625b7df2fa8abe21b0a976736cda4775523aed1e', '0x39546945695dcb1c037c836925b355262f551f55', '0x96ea6af74af09522fcb4c28c269c26f59a31ced6', '0x0fcdaedfb8a7dfda2e9838564c5a1665d856afdf', '0x7f83935ecfe4729c4ea592ab2bc1a32588409797', '0x123964ebe096a920dae00fb795ffbfa0c9ff4675', '0x5334e150b938dd2b6bd040d9c4a03cff0ced3765', '0x7ff566e1d69deff32a7b244ae7276b9f90e9d0f6', '0xbacb69571323575c6a5a3b4f9eede1dc7d31fbc1', '0xb4d1be44bff40ad6e506edf43156577a3f8672ec', '0x8414db07a7f743debafb402070ab01a4e0d2e45e', '0x986b4aff588a109c09b50a03f42e4110e29d353f', '0xdcd90c7f6324cfa40d7169ef80b12031770b4325', '0x07fb4756f67bd46b748b16119e802f1f880fb2cc', '0xfe39ce91437c76178665d64d7a2694b0f6f17fe3', '0x1b5eb1173d2bf770e50f10410c9a96f7a8eb6e75', '0xf6c9e9af314982a4b38366f4abfaa00595c5a6fc', '0xa9fe4601811213c340e850ea305481aff02f5b28', '0xe14d13d8b3b85af791b2aadd661cdbd5e6097db1', '0xc2cb1040220768554cf699b0d863a3cd4324ce32', '0xacd43e627e64355f1861cec6d3a6688b31a6f952', '0x19d3364a399d251e894ac732651be8b0e4e85001', '0x020171085bcd43b6fd36ad8c95ad61848b1211a2', '0xec0d8d3ed5477106c6d4ea27d90a60e594693c90', '0x881b06da56bb5675c54e4ed311c21e54c5025298', '0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a', '0x26ea744e5b887e5205727f55dfbe8685e3b21951', '0x5f18c75abdae578b483e5f43f12a39cf75b973a9', '0xe6354ed5bc4b393a5aad09f21c46e101e692d447', '0x2f08119c6f07c006695e079aafc638b8789faf18', '0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a', '0xda816459f1ab5631232fe5e97a05bbbb94970c95', '0xc5bddf9843308380375a611c18b50fb9341f502a', '0xe11ba472f74869176652c35d30db89854b5ae84d', '0xe0db48b4f71752c4bef16de1dbd042b82976b8c7', '0xa354f35829ae975e850e23e9615b11da1b3dc4de', '0xe1237aa7f535b0cc33fd973d66cbf830354d16c7', '0x04aa51bbcb46541455ccf1b8bef2ebc5d3787ec9', '0x9d25057e62939d3408406975ad75ffe834da4cdd', '0x36324b8168f960a12a8fd01406c9c78143d41380', '0xa2609b2b43ac0f5ebe27deb944d2a399c201e3da', '0xa1787206d5b1be0f432c4c4f96dc4d1257a1dd14', '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c', '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4', '0xface851a4921ce59e912d19329929ce6da6eb0c7', '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b', '0xf5dce57282a584d2746faf1593d3121fcac444dc', '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7', '0x12392f67bdf24fae0af363c24ac620a2f67dad86', '0xccf4429db6322d5c611ee964527d42e5d685dd6a', '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946', '0x6d903f6003cca6255d85cca4d3b5e5146dc33925', '0x2e088a0a19dda628b4304301d1ea70b114e4accd', '0xa1bc2cf69d474b39b91665e24e7f2606ed142991', '0x25e12482a25cf36ec70fda2a09c1ed077fc21616', '0xf403c135812408bfbe8713b5a23a04b3d48aae31', '0x92cf9e5e4d1dfbf7da0d2bb3e884a68416a65070', '0x5f465e9fcffc217c5849906216581a657cd60605', '0x8014595f2ab54cd7c604b00e9fb932176fdc86ae', '0xd18140b4b819b895a3dba5442f959fa44994af50', '0xcf50b810e57ac33b91dcf525c6ddd9881b139332', '0xe096ccec4a1d36f191189fe61e803d8b2044dfc3', '0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e', '0x947b7742c403f20e5faccdac5e092c943e7d0277', '0xa3c5a1e09150b75ff251c1a7815a07182c3de2fb', '0xae5f315a5b5dd4dbacd38862562a51490e500183', '0xedccb35798fae4925718a43cc608ae136208aa8d', '0x877288c4e6eba4f635ba7428706447353b47de75', '0x3c995e43e6ddd551e226f4c5544c77bfed147ab9', '0x1389388d01708118b497f59521f6943be2541bb7', '0xe98984ad858075813ada4261af47e68a64e28fcc', '0xdecc7d761496d30f30b92bdf764fb8803c79360d', '0x989aeb4d175e16225e39e87d0d97a3360524ad80', '0x989aeb4d175e16225e39e87d0d97a3360524ad80',
    '0x794a61358d6845594f94dc1db02a252b5b4814ad', '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf', '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    '0x5a98fcbea516cf06857215779fd812ca3bef1b32', '0x9ee91f9f426fa633d227f7a9b000e28b9dfd8599', '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0']
//guage chart configuration
var config = {
  type: 'gauge',
  data: {
    labels: ['Aware (0-99)', 'Competent (100-599)', 'Forward (600-850+)'],
    datasets: [{
      data: [99, 599, 850],
      value: [],
      minValue: 0,
      backgroundColor: [
        '#d39dee',
        '#bf5cf0',
        '#a81bee'
      ],
      borderWidth: 0.8,
      borderColor: 'white'
    }]
  },
  options: {
    responsive: true,
    animateScale: true,
    title: {
      display: false,
      text: 'Gauge chart with datalabels plugin displaying labels'
    },
    layout: {
      padding: {
        bottom: 15,
        // top: 40
      }
    },
    needle: {
      radiusPercentage: 3,
      widthPercentage: 3,
      lengthPercentage: 80,
      color: 'white'
    },
    valueLabel: {
      display: false
    },
    plugins: {
      datalabels: {
        display: true,
        formatter: function (value, context) {
          return context.chart.data.labels[context.dataIndex];
        },
        color: 'white',
        backgroundColor: null,
        font: {
          size: 12,
        }
      }
    }
  }
};
window.onload = function () {
  var ctx = document.getElementById('chart').getContext('2d');
  window.myGauge = new Chart(ctx, config);
};
Chart.defaults.global.defaultFontFamily = "Avenir", "Helvetica", "sans-serif";
