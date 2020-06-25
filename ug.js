// Add, remove, modify your articles here
document.addEventListener("DOMContentLoaded", function() {
    var articles = [
      {
        onClickLink: 'https://youtu.be/BhYtyjjjxvM',
        imgageSource: 'https://i.imgur.com/PP201dL.jpg',
        title: 'Đội quân điện tử Syria là nhóm tin tặc có mục đích hoạt động chặt chẽ, nhằm chống lại các nhóm đối lập ở Syria. SEA  ủng hộ tích cực của chính quyền Tổng thống Bashar al-Assad Thành viên (The Soul, Vict0r, The Shadow, The Pro ) '
      },
      {
        onClickLink: 'https://twitter.com/SEATh3Pr0',
        imgageSource: 'https://www7.0zz0.com/2020/06/25/14/715279580.png',
        title: ' Th3 Pr0 (The Pro) Lãnh đạo Cục Điều hành Đặc biệt,  một số thành tựu của ông: hack Đại học Harvard, Marines, Blogs skype, google qa, Forbes .  '
      },
      {
        onClickLink: 'https://twitter.com/Th3Shad0w_SEA',
        imgageSource: 'https://scontent.fsgn6-1.fna.fbcdn.net/v/t31.0-8/1262509_1376379452597724_947727758_o.jpg?_nc_cat=107&_nc_sid=dd9801&_nc_ohc=heP1S-LxMO8AX-L6ZeG&_nc_ht=scontent.fsgn6-1.fna&oh=101684eb98b3e22499138c08ba559dc4&oe=5F18D5CA',
        title: ' Một trong những người đã gia nhập SEA từ khi thành lập. Ông có một danh sách những thành tựu đáng chú ý trong việc hack vào các phương tiện truyền thông, bao gồm Associated Press, Guardian Blog linkedin và phương tiện truyền thông khác'
           },
      {
        onClickLink: 'https://twitter.com/Vict0rSEA',
        imgageSource: 'https://pbs.twimg.com/profile_banners/1633632745/1375211080/1500x500',
        title: ' Một chàng trai trẻ gia nhập quân đội điện tử Syria kể từ khi thành lập với tư cách là lập trình viên. Anh ta cũng thiết kế và lập trình tất cả các trang web của SEA '
      },
      {
        onClickLink: 'https://twitter.com/sea_the_soul',
        imgageSource: 'https://web.archive.org/web/20131104155548if_/http://www.sea.sy/uploaded_files/team/thesoul.jpg',
        title: 'Một nhà lãnh đạo trong quân đội điện tử Syria và đã tham gia kể từ khi thành lập, chịu trách nhiệm quản lý các tài khoản mạng xã hội của SEA .'
      },
      {
        onClickLink: 'https://pbs.twimg.com/media/BmjdZqECQAE6Xsg?format=jpg&name=small',
        imgageSource: 'https://pbs.twimg.com/media/BmjdZqECQAE6Xsg?format=jpg&name=small',
        title: 'The celebration cake alongside 3 laptops'
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
