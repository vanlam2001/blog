// Add, remove, modify your articles here
document.addEventListener("DOMContentLoaded", function() {
    var articles = [
      {
        onClickLink: 'https://www.youtube.com/watch?v=OR6v_cd_XhY&t=208s',
        imgageSource: 'https://syrianfreepress.files.wordpress.com/2013/11/syrian-electronic-army-20131130.jpg',
        title: 'Interwiew Syrian Electronic Army, Cuộc phỏng vấn trực tiếp đầu tiên với Đội Quân Điện Tử Syria'
      },
      {
        onClickLink: 'https://youtu.be/9zd9XqwXbWQ',
        imgageSource: 'https://www3.0zz0.com/2020/07/25/10/452382878.jpg',
        title: 'Một trong những bước đột phá của Syrian Electronic Army (The Shadow)'
      },
      {
        onClickLink: 'https://youtu.be/Oh-POU60WzY',
        imgageSource: 'https://news-cdn.softpedia.com/images/news2/Harvard-Website-Hacked-by-Th3Pro-2.jpg',
        title: ' Trang web Harvard University  bị hack bởi th3pr0 (The Pro) Syrian Electronic Army (SEA) (27-09-2011)'
    },
      {
        onClickLink: 'https://youtu.be/KfaXHHeoz7o',
        imgageSource: 'https://i.ytimg.com/vi/AB2Q85SEaqo/hqdefault.jpg',
        title: 'Dịch vụ Al-Jazeera Mobile bị hack (Syrian Electronic Army) (10/9/2012)'
      },
      {
        onClickLink: 'https://youtu.be/_EGqCjHm5jE',
        imgageSource: 'https://www3.0zz0.com/2020/07/25/10/452382878.jpg',
        title: 'Website Anonymous hacked by SEA (19/07/2012)'
      },
      {
        onClickLink: 'https://youtu.be/ZDT6LPAVaWI',
        imgageSource: 'https://i.ytimg.com/vi/ZDT6LPAVaWI/maxresdefault.jpg',
        title: 'Syrian Electronic Army ra mắt hệ điều hành SEANUX (2.0) (29/04/2015)'
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
