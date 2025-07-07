let itemsContainerElement = document.querySelector('.container');

let innerHTML = '';
items.forEach(item =>{
    innerHTML += `
<div class="items">
            <div class="item-image">
                <img id="item1" src="${item.image}" alt="">
            </div>
            <span class="item-rating">${item.rating.stars}⭐️</span>||
            <span class="rating">${item.rating.count}</span>
            <div class="company-name">
                ${item.company}
            </div>
            <div class="item_name">
                ${item.item_name}
            </div>
            <div class="price">
            <span class="current-price">${item.current_price}</span>
            <span class="original-price ">Rs 1045</span>
            <span class="discount">(42% OFF)</span>
            </div>
            <div class="btn-add-bag">
                <button class="btn-add-bag">Add to Bag</button>
            </div>
        </div>`
});

itemsContainerElement.innerHTML = innerHTML;