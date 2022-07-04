let nfts = null;
let urlSearch = null;
let menus = [];

let swiper = null;

window.addEventListener("load", function () {
  loadNFTs();

  swiper = new Swiper(".main-banner", {
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    observer: true,
    observeParents: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  urlSearch = new URLSearchParams(location.search);

  switch (urlSearch.get("page")) {
    case "minting":
      changeNavMenu(1);
      changePage(1);
      break;
    case "event":
      changeNavMenu(2);
      changePage(2);
      break;
    case "community":
      changeNavMenu(3);
      changePage(3);
      break;
    default:
      changeNavMenu(0);
      changePage(0);
      history.pushState(null, null, "/");
      break;
  }
});

function changeURL(num) {
  urlSearch = new URLSearchParams(location.search);

  if (num == 0 && urlSearch.get("page") == null) {
    return;
  } else if (num == 1 && urlSearch.get("page") == "minting") {
    return;
  } else if (num == 2 && urlSearch.get("page") == "event") {
    return;
  } else if (num == 3 && urlSearch.get("page") == "community") {
    return;
  }

  switch (num) {
    case 0:
      urlSearch.delete("page");
      history.pushState(null, null, "/");
      break;
    case 1:
      urlSearch.set("page", "minting");
      history.pushState(null, null, "?" + urlSearch.toString());
      break;
    case 2:
      urlSearch.set("page", "event");
      history.pushState(null, null, "?" + urlSearch.toString());
      break;
    case 3:
      urlSearch.set("page", "community");
      history.pushState(null, null, "?" + urlSearch.toString());
      break;
  }

  changeNavMenu(num);
  changePage(num);
}

function changeNavMenu(num) {
  if (menus.length != 4) {
    menus = document.querySelectorAll(".nav-menu");
  }

  for (let i = 0; i < menus.length; i++) {
    if (menus[i].classList.contains("nav-selected")) {
      menus[i].classList.remove("nav-selected");
    }
  }

  menus[num].classList.add("nav-selected");
}

function changePage(num) {
  let nftWrappers = document.querySelectorAll(".nft-wrapper");

  if (num == 3) {
    document.querySelector(".nfts-wrapper").style.display = "none";
    document.querySelector(".community-section").style.display = "flex";
  } else {
    document.querySelector(".nfts-wrapper").style.display = "grid";
    document.querySelector(".community-section").style.display = "none";
  }

  if (num == 0) {
    document.querySelector(".main-banner").style.display = "block";
  } else {
    document.querySelector(".main-banner").style.display = "none";
  }

  for (let i = 0; i < nftWrappers.length; i++) {
    if (
      (num == 1 && nftWrappers[i].classList.contains("event")) ||
      (num == 2 && nftWrappers[i].classList.contains("minting")) ||
      num == 3
    ) {
      nftWrappers[i].style.display = "none";
    } else {
      nftWrappers[i].style.display = "flex";
    }
  }

  swiper.slideTo(1, 0, false);
  window.scrollTo(0, 0);
}

function loadNFTs() {
  nftDatas = JSON.parse(JSON.stringify(nftList));
  nftDatas = nftDatas.sort((a, b) => new Date(a.start) - new Date(b.start));

  for (let i = 0; i < nftDatas.length; i++) {
    let el_wrapper = document.createElement("a");
    if (nftDatas[i].stage == "OG WL" || nftDatas[i].stage == "Giveaway") {
      el_wrapper.setAttribute("class", "nft-wrapper event");
    } else {
      el_wrapper.setAttribute("class", "nft-wrapper minting");
    }

    el_wrapper.setAttribute("target", "_blank");
    el_wrapper.setAttribute("href", nftDatas[i].url);

    let el_img = document.createElement("img");
    el_img.setAttribute("src", nftDatas[i].src);
    el_img.setAttribute("alt", nftDatas[i].project + " NFT");

    let el_hr = document.createElement("hr");

    let el_info = document.createElement("div");
    el_info.setAttribute("class", "nft-info");

    let el_tag = document.createElement("div");
    el_tag.setAttribute("class", "nft-tag");

    let el_stage = document.createElement("div");
    el_stage.innerHTML = nftDatas[i].stage;

    switch (nftDatas[i].stage) {
      case "OG WL":
        el_stage.setAttribute("class", "ogwl");
        break;
      case "Giveaway":
        el_stage.setAttribute("class", "giveaway");
        break;
      case "Private Sale":
        el_stage.setAttribute("class", "private-sale");
        break;
      case "Public Sale":
        el_stage.setAttribute("class", "public-sale");
        break;
    }

    /**
    let el_blockchain = document.createElement("div");
    el_blockchain.innerHTML = nftDatas[i].blockchain;
    el_blockchain.setAttribute("class", nftDatas[i].blockchain.toLowerCase());
     */

    let el_title = document.createElement("div");
    el_title.setAttribute("class", "nft-title");
    el_title.innerHTML = nftDatas[i].title;

    let el_date = document.createElement("div");
    el_date.setAttribute("class", "nft-date");
    el_date.innerHTML = nftDatas[i].start + " ~ " + nftDatas[i].end;

    el_tag.appendChild(el_stage);
    // el_tag.appendChild(el_blockchain);

    el_info.appendChild(el_tag);
    el_info.appendChild(el_title);
    el_info.appendChild(el_date);

    el_wrapper.appendChild(el_img);
    el_wrapper.appendChild(el_hr);
    el_wrapper.appendChild(el_info);

    if (new Date() - new Date(nftDatas[i].end) > 0) {
      el_wrapper.remove();
    } else {
      document.querySelector(".nfts-wrapper").appendChild(el_wrapper);
    }
  }
}
