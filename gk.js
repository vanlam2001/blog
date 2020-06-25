// Add, remove, modify your articles here
document.addEventListener("DOMContentLoaded", function() {
    var articles = [
      {
        onClickLink: 'http://web.archive.org/web/20130810071810im_/http://sea.sy/uploaded_files/articles/1964.jpg',
        imgageSource: 'http://web.archive.org/web/20130810071810im_/http://sea.sy/uploaded_files/articles/1964.jpg',
        title: 'Tài khoản Twitter Financial Times bị hack bởi th3pr0 (The Pro) là thành viên của Syrian Electronic Army (SEA) ( 17/05/2013) '
      },
      {
        onClickLink: 'http://web.archive.org/web/20130810035900im_/http://sea.sy/uploaded_files/articles/1968.jpg',
        imgageSource: 'http://web.archive.org/web/20130810035900im_/http://sea.sy/uploaded_files/articles/1968.jpg',
        title: 'Ứng dụng  Sky News bị hack bởi th3pr0 (The Pro)  Syrian Electronic Army (SEA) (19/05/2013)'
      },
      {
        onClickLink: 'http://web.archive.org/web/20141128215319im_/http://sea.sy/uploaded_files/articles/1951.jpg',
        imgageSource: 'http://web.archive.org/web/20141128215319im_/http://sea.sy/uploaded_files/articles/1951.jpg',
        title: ' Tài khoản Twitter Guardian bị hack bởi th3pr0 (The Pro) Syrian Electronic Army (SEA) (28-04-2013)'
    },
      {
        onClickLink: 'http://web.archive.org/web/20130810052628im_/http://sea.sy/uploaded_files/articles/1957.jpg',
        imgageSource: 'http://web.archive.org/web/20130810052628im_/http://sea.sy/uploaded_files/articles/1957.jpg',
        title: ' Tài khoản Twitter The Onion bị hack bởi th3pr0 (The Pro) Syrian Electronic Army (SEA) (05/6/2013)'
      },
      {
        onClickLink: 'https://web.archive.org/web/20130810043247im_/http://sea.sy/uploaded_files/articles/1979.jpg',
        imgageSource: 'https://web.archive.org/web/20130810043247im_/http://sea.sy/uploaded_files/articles/1979.jpg',
        title: 'Cơ sở dữ liệu True Caller bị hack, Trang quản trị Wordpress True Caller đã bị chiếm quyền điều khiển bởi Th3Pr0 (SEA)  (17/07/2013)'
      },
      {
        onClickLink: 'http://web.archive.org/web/20130809222604im_/http://sea.sy/uploaded_files/articles/1967.jpg',
        imgageSource: 'http://web.archive.org/web/20130809222604im_/http://sea.sy/uploaded_files/articles/1967.jpg',
        title: 'Tài khoản Twitter  Financial Times bị hack bởi Th3Pr0  (SEA) (17/05/2013)'
      }
      
      
    ]

    var rootElement = document.getElementById("imageGalleryWithTitle");

    for (let i=0; i < articles.length; i++) {
      //Create the container
      var itemContainer = document.createElement("a");
      itemContainer.classList.add("article-container");
      var href = document.createAttribute("href");
      href.value = articles[i].onClickLink;
      itemContainer.setAttributeNode(href);
      var target = document.createAttribute("target");
      target.value = '_blank';
      itemContainer.setAttributeNode(target);

      //Create Image
      var image = document.createElement("img");
      image.classList.add("article-image");
      var src = document.createAttribute("src");
      src.value = articles[i].imgageSource;
      image.setAttributeNode(src);
      var alt = document.createAttribute("alt");
      alt.value = articles[i].title;
      image.setAttributeNode(alt);

      //Create title
      var h3 = document.createElement("h3");
      h3.classList.add("article-title");
      var h3Text = document.createTextNode(articles[i].title);
      h3.appendChild(h3Text);

      //Atach image and title to container
      itemContainer.appendChild(image);
      itemContainer.appendChild(h3);

      //Attach element to root div
      rootElement.appendChild(itemContainer);
    }
  });
