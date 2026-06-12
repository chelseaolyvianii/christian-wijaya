//product detail
function addToCart(productId, productName, price, quantity, imageUrl, variant, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.variant === variant && 
        item.size === size
    );
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity,
            image: imageUrl,
            variant: variant,
            size: size
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`${productName} added to cart successfully!`);
    
    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();
    
    const addToCartBtn = document.querySelector('.single-pro-details .add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const variantSelect = document.getElementById('variant-select');
            const sizeSelect = document.getElementById('size-select');
            const variantError = document.getElementById('variant-error');
            const sizeError = document.getElementById('size-error');
            
            let isValid = true;
            
            variantError.style.display = 'none';
            sizeError.style.display = 'none';
            variantSelect.style.borderColor = '';
            sizeSelect.style.borderColor = '';
            
            if (!variantSelect.value) {
                variantError.style.display = 'block';
                variantSelect.style.borderColor = '#ff6b6b';
                isValid = false;
            }
            
            if (!sizeSelect.value) {
                sizeError.style.display = 'block';
                sizeSelect.style.borderColor = '#ff6b6b';
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            const productName = document.querySelector('.single-pro-details h4').textContent;
            const priceText = document.querySelector('.single-pro-details h2').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));
            const quantity = parseInt(document.querySelector('.single-pro-details input[type="number"]').value);
            const imageUrl = document.querySelector('.single-pro-image img').src;
            const variant = variantSelect.value;
            const size = sizeSelect.value;
            
            const productId = productName.toLowerCase().replace(/\s+/g, '-');
            
            addToCart(productId, productName, price, quantity, imageUrl, variant, size);
        });
    }
});

// order now
// Fungsi khusus untuk Order Now
function handleOrderNow() {
    // Validasi pemilihan variant dan size
    if (!validateProductSelection()) {
        return;
    }

    // Dapatkan detail produk
    const productDetails = getProductDetails();
    
    // Buat cart baru hanya dengan produk ini
    const newCart = [{
        id: productDetails.productId,
        name: productDetails.productName,
        price: productDetails.price,
        quantity: productDetails.quantity,
        image: productDetails.imageUrl,
        variant: productDetails.variant,
        size: productDetails.size
    }];

    // Simpan ke localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Update cart counter
    updateCartCounter();
    
    // Redirect ke halaman checkout
    window.location.href = 'ordernow.html';
}

// Event listener untuk Order Now
document.addEventListener('DOMContentLoaded', function() {
    const orderNowBtn = document.querySelector('.order-now');
    
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleOrderNow();
        });
    }
});

// Fungsi untuk validasi pemilihan produk
function validateProductSelection() {
    const variantSelect = document.getElementById('variant-select');
    const sizeSelect = document.getElementById('size-select');
    let isValid = true;

    // Reset error state
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    variantSelect.style.borderColor = '';
    sizeSelect.style.borderColor = '';

    // Validasi variant
    if (!variantSelect.value) {
        document.getElementById('variant-error').style.display = 'block';
        variantSelect.style.borderColor = '#ff6b6b';
        isValid = false;
    }

    // Validasi size
    if (!sizeSelect.value) {
        document.getElementById('size-error').style.display = 'block';
        sizeSelect.style.borderColor = '#ff6b6b';
        isValid = false;
    }

    return isValid;
}

// Fungsi untuk mendapatkan detail produk
function getProductDetails() {
    const productName = document.querySelector('.single-pro-details h4').textContent;
    const priceText = document.querySelector('.single-pro-details h2').textContent;
    const price = parseInt(priceText.replace(/\D/g, ''));
    const quantity = parseInt(document.querySelector('.single-pro-details input[type="number"]').value);
    const imageUrl = document.querySelector('.single-pro-image img').src;
    const variant = document.getElementById('variant-select').value;
    const size = document.getElementById('size-select').value;
    
    // Generate product ID dari nama produk
    const productId = productName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    return {
        productId,
        productName,
        price,
        quantity,
        imageUrl,
        variant,
        size
    };
}

// event page
document.addEventListener('DOMContentLoaded', function() {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const birthDate = document.getElementById('birthDate');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const cv = document.getElementById('cv');
    const terms = document.getElementById('terms');
    const form = document.getElementById('registrationForm');

    fullName.addEventListener('blur', function() {
        validateName(fullName, 'Full name');
    });

    email.addEventListener('blur', function() {
        if (!email.value.includes('@')) {
            showError(email, 'Email must contain @ symbol', 'emailError');
        } else {
            clearError(email, 'emailError');
        }
    });

    birthDate.addEventListener('blur', function() {
        if (!birthDate.value) {
            showError(birthDate, 'Please enter your birthdate', 'birthDateError');
            return;
        }

        const birthDateObj = new Date(birthDate.value);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        
        if (age < 17) {
            showError(birthDate, 'You must be at least 17 years old', 'birthDateError');
        } else {
            clearError(birthDate, 'birthDateError');
        }
    });

    cv.addEventListener('change', function() {
        validateCV(cv);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        if (!validateName(fullName, 'Full name')) isValid = false;
        
        if (!email.value.includes('@')) {
            showError(email, 'Email must contain @ symbol', 'emailError');
            isValid = false;
        } else {
            clearError(email, 'emailError');
        }

        if (!birthDate.value) {
            showError(birthDate, 'Please enter your birthdate', 'birthDateError');
            isValid = false;
        }

        const genderSelected = Array.from(genderInputs).some(input => input.checked);
        if (!genderSelected) {
            document.getElementById('genderError').textContent = 'Please select your gender';
            document.getElementById('genderError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('genderError').style.display = 'none';
        }

        if (!cv.value) {
            document.getElementById('cvError').textContent = 'Please upload your CV/Portfolio';
            document.getElementById('cvError').style.display = 'block';
            isValid = false;
        } else if (!validateCV(cv)) {
            isValid = false;
        } else {
            document.getElementById('cvError').style.display = 'none';
        }

        if (!terms.checked) {
            document.getElementById('termsError').textContent = 'You must accept the terms and conditions';
            document.getElementById('termsError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('termsError').style.display = 'none';
        }

        if (isValid) {
            alert('Form successfully submitted!');
            document.getElementById('registrationForm').reset();
            
            document.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });
            
            document.querySelectorAll('.error-field').forEach(field => {
                field.classList.remove('error-field');
            });
        }
    });

    function validateName(input, fieldName) {
        if (!input.value) {
            showError(input, `${fieldName} is required`, 'nameError');
            return false;
        }
        
        if (input.value[0] !== input.value[0].toUpperCase()) {
            showError(input, 'First letter must be capitalized', 'nameError');
            return false;
        }
        
        clearError(input, 'nameError');
        return true;
    }

    function validateCV(input) {
        const maxSize = 5 * 1024 * 1024; 
        const file = input.files[0];
        
        if (!file) {
            document.getElementById('cvError').textContent = 'Please upload your CV/Portfolio';
            document.getElementById('cvError').style.display = 'block';
            input.classList.add('error-field');
            return false;
        }
        
        if (file.type !== 'application/pdf') {
            document.getElementById('cvError').textContent = 'Only PDF files are allowed';
            document.getElementById('cvError').style.display = 'block';
            input.classList.add('error-field');
            return false;
        }
        
        if (file.size > maxSize) {
            document.getElementById('cvError').textContent = 'File size must be less than 5MB';
            document.getElementById('cvError').style.display = 'block';
            input.classList.add('error-field');
            return false;
        }
        
        document.getElementById('cvError').style.display = 'none';
        input.classList.remove('error-field');
        return true;
    }

    function showError(input, message, errorId) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('error-field');
    }

    function clearError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        errorElement.style.display = 'none';
        input.classList.remove('error-field');
    }
});

function showDesktopNotification(name, email) {
    new Notification("Application Received!", {
        body: `Thank you ${name}! We'll contact you at ${email} soon.`,
        icon: "picture/logo1.png" 
    });
}

function showFallbackAlert(name, email) {
    Swal.fire({
        title: 'Application Submitted!',
        html: `Thank you <strong>${name}</strong>! We'll review your application and contact you at <strong>${email}</strong>.`,
        icon: 'success',
        confirmButtonColor: '#630000'
    });
}

// about us vid
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.designer-video');
    const playPauseBtn = document.querySelector('.play-pause');
    const progress = document.querySelector('.progress');
    const timeline = document.querySelector('.timeline');
    const fullscreenBtn = document.querySelector('.fullscreen');
    
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    video.addEventListener('timeupdate', function() {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = `${percent}%`;
    });
    
    timeline.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const pos = (e.pageX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });
    
    fullscreenBtn.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });

    video.addEventListener('ended', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
});

//cart
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

function removeFromCart(productId, variant, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart = cart.filter(item => 
        !(item.id === productId && 
          item.variant === variant && 
          item.size === size)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    return cart;
}

function updateCartItemQuantity(productId, variant, size, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const itemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.variant === variant && 
        item.size === size
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    
    let subtotal = 0;
    let itemCount = 0;
    
    checkedItems.forEach(checkbox => {
        const cartItem = checkbox.closest('.cart-item');
        const priceText = cartItem.querySelector('.cart-item-details p:nth-child(3)').textContent;
        const price = parseInt(priceText.replace(/\D/g, ''));
        const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
        
        subtotal += price * quantity;
        itemCount += quantity;
    });
    
    const shipping = itemCount > 0 ? 25000 : 0;
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + shipping + tax;
    
    document.getElementById('summary-item-count').textContent = itemCount;
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = `Rp ${shipping.toLocaleString()}`;
    document.getElementById('tax').textContent = `Rp ${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `Rp ${total.toLocaleString()}`;
    document.getElementById('item-count').textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} Items`;
}

function setupEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const variant = cartItem.dataset.variant;
            const size = cartItem.dataset.size;
            
            if (confirm('Are you sure you want to remove this item from your cart?')) {
                cartItem.classList.add('removing');
                setTimeout(() => {
                    removeFromCart(productId, variant, size);
                    loadCart();
                }, 300);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus') && value > 1) {
                input.value = value - 1;
            } else if (this.classList.contains('plus')) {
                input.value = value + 1;
            }
            
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const variant = cartItem.dataset.variant;
            const size = cartItem.dataset.size;
            
            updateCartItemQuantity(productId, variant, size, parseInt(input.value));
            updateCartSummary();
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
            
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.id;
            const variant = cartItem.dataset.variant;
            const size = cartItem.dataset.size;
            
            updateCartItemQuantity(productId, variant, size, parseInt(this.value));
            updateCartSummary();
        });
    });
    
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCartSummary();
            updateSelectAllCheckbox();
        });
    });
    
    document.getElementById('select-all').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateCartSummary();
    });
}

function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const allChecked = checkboxes.length > 0 && 
                      Array.from(checkboxes).every(checkbox => checkbox.checked);
    document.getElementById('select-all').checked = allChecked;
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items-container');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h4>Your cart is empty</h4>
                <p>You haven't added any items to your cart yet.</p>
                <button class="normal" onclick="window.location.href='product.html'">Continue Shopping</button>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" 
             data-id="${item.id}" 
             data-variant="${item.variant}" 
             data-size="${item.size}">
            <input type="checkbox" class="item-checkbox" checked>
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Variant: ${item.variant} | Size: ${item.size}</p>
                <p>Rp ${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="remove-btn">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
    
    setupEventListeners();
    updateCartSummary();
    updateSelectAllCheckbox();
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCounter();
});

// ordernow
document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutItems();
    
    document.getElementById('paymentMethod').addEventListener('change', function() {
        document.querySelectorAll('.payment-instructions').forEach(el => {
            el.style.display = 'none';
        });
        
        const selectedMethod = this.value;
        if (selectedMethod) {
            document.getElementById(`${selectedMethod}Instructions`).style.display = 'block';
        }
    });
    document.getElementById('shippingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCheckoutForm()) {
            processOrder();
        }
    });
});

function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('checkoutItems');
    let subtotal = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>No items in cart</p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <p>Variant: ${item.variant} | Size: ${item.size}</p>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div class="checkout-item-price">
                Rp ${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
    
    subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax + 25000;
    
    document.getElementById('checkoutSubtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('checkoutTax').textContent = `Rp ${tax.toLocaleString()}`;
    document.getElementById('checkoutTotal').textContent = `Rp ${total.toLocaleString()}`;
}

function validateCheckoutForm() {
    let isValid = true;
    const form = document.getElementById('shippingForm');
    
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!document.getElementById('paymentMethod').value) {
        alert('Please select a payment method');
        isValid = false;
    }
    
    if (!document.getElementById('acceptTerms').checked) {
        alert('You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function processOrder() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const methodNames = {
        'bca': 'BCA Transfer',
        'gopay': 'Gopay',
        'ovo': 'OVO'
    };
    
    alert(`Order placed successfully!\nPayment Method: ${methodNames[paymentMethod]}\nThank you for your purchase.`);
    
    localStorage.removeItem('cart');
    window.location.href = 'order-confirmation.html';
}