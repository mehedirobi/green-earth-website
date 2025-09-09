let allPlants = [];

// Load all categories
const getCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => showCategories(data.categories))
}

// Show all categories
const showCategories = (list) => {

        let category = document.getElementById('category-container');
        category.innerHTML = '';
        list.forEach((item, i) => {
            let btn = document.createElement('button');
            btn.innerText =item.category_name;
            btn.className = 'btn block border-none btn-outline hover:bg-green-600 mb-2';
            btn.onclick = () => {

    category.querySelectorAll('button').forEach(b => b.classList.remove('bg-green-600', 'text-white'));

   
    btn.classList.add('bg-green-600', 'text-white');

    const filtered = allPlants.filter(p => p.category === item.category_name);
    showPlants(filtered);
}
            category.appendChild(btn)

        })
}

// Load plant section
const getPlants = () => {
    showSpinner()
    fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => {
        allPlants = data.plants;
        showPlants(allPlants)
})
    .catch(err => console.error(err))
    .finally(() => hideSpinner());
}

// Show plants

const showPlants = (plants) => {
    const treeContainer = document.getElementById('tree-container');
    treeContainer.innerHTML = '';

    if(plants.length === 0){
        treeContainer.innerHTML = `<p class="text bg-red-500 font-bold text-center ">
        No plants found in this category
        </p>
        `
        return;
    }
    plants.forEach(p => {
        const div = document.createElement('div');
        
        div.className = 'card bg-white shadow-xl p-4 h-full flex flex-col justify-between';
        div.innerHTML = `
        
            <img src="${p.image}" class="rounded-xl lg:h-40 w-full object-cover" alt="${p.name}">
            <h2 onclick='getDetails(${p.id})' class='text-xl font-bold'>${p.name}</h2>
            <p>${p.description ? p.description.slice(0,50) : ''}...</p>
            <div class="flex justify-between">
            <p class="border-2 border-sky-300 rounded-3xl lg:px-2 mt-2 mb-2 text-sky-500">${p.category}</p>
            <p class="text-green-600 font-bold mt-2 mb-2"> ${p.price} $</p>
            </div>
            <button class='btn btn-success mt-2 rounded-3xl'>Add to cart</button>
        `;
        div.querySelector('button').onclick = () => addToCart(p);
        treeContainer.appendChild(div);
    });
}

// Show modal
const getDetails = (id) => {
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => {
        const plant = data.plants;
        showPlantModal(plant)
    })
    .catch(err => console.error(err));
}

const showPlantModal = (plant) => {
    
    const existingModal = document.getElementById('plant-modal');
    if(existingModal) existingModal.remove();

    
    const modal = document.createElement('div');
    modal.id = 'plant-modal';
    modal.className = 'fixed inset-0 bg-opacity-50 flex items-center justify-center z-50';

    modal.innerHTML = `
        <div class="bg-white rounded-xl p-5 max-w-md w-full relative">
            <button id="close-modal" class="absolute top-2 right-2 text-red-500 font-bold text-xl">×</button>
            <h2 class="text-2xl font-bold mb-3">${plant.name}</h2>
            <img src="${plant.image}" alt="${plant.name}" class="rounded-xl w-full h-48 object-cover mb-3">
            <p><b>Category:</b> ${plant.category}</p>
            <p><b>Price:</b> ${plant.price} $</p>
            <p class="mt-3">${plant.description}</p>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-modal').onclick = () => {
        modal.remove();
    }

    modal.onclick = (e) => {
        if(e.target === modal) modal.remove();
    }
}

// Add to card container
let cart = [];

const addToCart = (plant) => {
    cart.push(plant);
    updateCart();
}

const updateCart = () => {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    if(cart.length === 0){
        cartContainer.innerHTML = `<p class="text-gray-500">Cart is empty</p>`;
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center border-b py-2';
        div.innerHTML = `
            <span>${item.name} - ${item.price} $</span>
            <button class="text-red-500" onclick="removeFromCart(${index})">×</button>
        `;
        cartContainer.appendChild(div);
    });

    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'mt-2 font-bold';
    totalDiv.innerText = `Total: ${total} $`;
    cartContainer.appendChild(totalDiv);
}


const removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
}





// Spinner
const showSpinner = () => {
    document.getElementById('spinner').classList.remove('hidden');
}

const hideSpinner = () => {
    document.getElementById('spinner').classList.add('hidden');
}




getCategories();
getPlants();
