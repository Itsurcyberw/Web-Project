// ===== DATA PERSISTENCE & INITIALIZATION =====
// Ensure localStorage is available
if (typeof(Storage) === "undefined") {
  console.warn("LocalStorage not supported. Data may not persist.");
} else {
  console.log("LocalStorage is available and data will persist across sessions.");
}

// ===== MOBILE OPTIMIZATION =====
// Disable unnecessary transitions on mobile for smoother scrolling
if (window.innerWidth <= 768) {
  document.addEventListener('touchstart', function() {
    document.body.style.webkitUserSelect = 'none';
  }, false);
}

// Add smooth scrolling support for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
  console.log("Smooth scrolling not natively supported");
}

// ===== CART MANAGEMENT =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = cart.length;
  });
}

function addToCart(productName, price) {
  cart.push({ name: productName, price: price, id: Date.now() });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${productName} added to cart!`);
}

// Initialize cart count on page load
updateCartCount();

// Ensure cart is saved to localStorage on page unload
window.addEventListener('beforeunload', function() {
  localStorage.setItem('cart', JSON.stringify(cart));
});

// ===== DATA VALIDATION & RECOVERY =====
function validateAndRestoreData() {
  // Validate and restore cart
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (Array.isArray(parsedCart)) {
        cart = parsedCart;
        console.log('Cart restored: ' + cart.length + ' items');
      }
    }
  } catch (e) {
    console.error('Error restoring cart:', e);
    cart = [];
  }

  // Validate and restore order history
  try {
    const storedOrders = localStorage.getItem('orderHistory');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      if (Array.isArray(parsedOrders)) {
        console.log('Order history restored: ' + parsedOrders.length + ' orders');
      }
    }
  } catch (e) {
    console.error('Error restoring order history:', e);
  }

  // Validate and restore discount coupon
  try {
    const discount = localStorage.getItem('discountCoupon');
    if (discount) {
      console.log('Discount restored: ' + discount);
    }
  } catch (e) {
    console.error('Error restoring discount:', e);
  }

  // Validate and restore delivery data
  try {
    const deliveryData = localStorage.getItem('deliveryData');
    if (deliveryData) {
      const parsed = JSON.parse(deliveryData);
      console.log('Delivery data restored for: ' + (parsed.fullName || 'Unknown'));
    }
  } catch (e) {
    console.error('Error restoring delivery data:', e);
  }

  // Validate and restore reviews
  try {
    const reviews = localStorage.getItem('reviews');
    if (reviews) {
      const parsedReviews = JSON.parse(reviews);
      if (Array.isArray(parsedReviews)) {
        console.log('Reviews restored: ' + parsedReviews.length + ' reviews');
      }
    }
  } catch (e) {
    console.error('Error restoring reviews:', e);
  }

  // Validate and restore gallery
  try {
    const gallery = localStorage.getItem('gallery');
    if (gallery) {
      const parsedGallery = JSON.parse(gallery);
      if (Array.isArray(parsedGallery)) {
        console.log('Gallery restored: ' + parsedGallery.length + ' images');
      }
    }
  } catch (e) {
    console.error('Error restoring gallery:', e);
  }
}

// Run validation and restoration on page load
validateAndRestoreData();

// Add to cart buttons
document.addEventListener('DOMContentLoaded', function() {
  const addToCartButtons = document.querySelectorAll('.addToCart');
  addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      const card = this.closest('.card');
      if (card) {
        const productName = card.querySelector('h3')?.textContent || 'Product ' + index;
        const priceText = card.querySelector('p')?.textContent || 'PKR 1000';
        const price = priceText.match(/\d+/) ? parseFloat(priceText.match(/\d+/)[0]) : 1000;
        addToCart(productName, price);
      }
    });
  });

  // ===== PATTERN CUSTOMIZER =====
  const previewSquare = document.getElementById('previewSquare');
  const yarnColor = document.getElementById('yarnColor');
  const stitchType = document.getElementById('stitchType');
  const sizeRange = document.getElementById('sizeRange');

  if (previewSquare && yarnColor) {
    function updatePreview() {
      const size = parseInt(sizeRange?.value || 200);
      const color = yarnColor.value;
      const stitch = stitchType?.value || 'dashed';

      previewSquare.style.width = size + 'px';
      previewSquare.style.height = size + 'px';
      previewSquare.style.background = color;
      previewSquare.style.borderStyle = stitch;
    }

    yarnColor?.addEventListener('input', updatePreview);
    stitchType?.addEventListener('change', updatePreview);
    sizeRange?.addEventListener('input', updatePreview);
    updatePreview();
  }

  // Color swatches from image
  const imageInput = document.getElementById('imageInput');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.getElementById('colorCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 50;
            canvas.height = 50;
            ctx.drawImage(img, 0, 0, 50, 50);
            
            const imageData = ctx.getImageData(0, 0, 50, 50).data;
            const colors = new Set();
            
            for (let i = 0; i < imageData.length; i += 4) {
              const r = imageData[i];
              const g = imageData[i + 1];
              const b = imageData[i + 2];
              const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
              if (colors.size < 5) colors.add(hex);
            }

            const swatches = document.getElementById('swatches');
            if (swatches) {
              swatches.innerHTML = '';
              colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'swatch';
                swatch.style.background = color;
                swatches.appendChild(swatch);
              });
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ===== MINI GAME =====
  const startGameBtn = document.getElementById('startGame');
  const gameQuestion = document.getElementById('question');
  const gameOptions = document.getElementById('options');
  const gameResult = document.getElementById('result');
  const gameScore = document.getElementById('score');
  const roundTracker = document.getElementById('roundTracker');

  if (startGameBtn) {
    const stitches = [
      { name: 'Single Crochet', image: '🧵', description: 'The most basic stitch' },
      { name: 'Double Crochet', image: '🧶', description: 'Taller than single crochet' },
      { name: 'Half Double Crochet', image: '🪡', description: 'Between single and double' },
      { name: 'Slip Stitch', image: '⛓️', description: 'Used to join rounds' }
    ];

    let score = 0;
    let round = 0;
    const maxRounds = 5;

    startGameBtn.addEventListener('click', function() {
      score = 0;
      round = 0;
      playRound();
    });

    function playRound() {
      if (round >= maxRounds) {
        gameQuestion.textContent = `Game Over! Final Score: ${score}/${maxRounds}`;
        gameOptions.innerHTML = '';
        gameResult.textContent = score >= 3 ? '🎉 Great job! You earned a 10% discount coupon!' : 'Try again!';
        startGameBtn.textContent = 'Play Again';
        localStorage.setItem('discountCoupon', score >= 3 ? '10% OFF' : 'none');
        return;
      }

      round++;
      if (roundTracker) roundTracker.textContent = `Round ${round} of ${maxRounds}`;

      const correctStitch = stitches[Math.floor(Math.random() * stitches.length)];
      gameQuestion.textContent = `What stitch is this? ${correctStitch.image} (${correctStitch.description})`;

      gameOptions.innerHTML = '';
      const options = stitches.sort(() => Math.random() - 0.5);

      options.forEach(stitch => {
        const btn = document.createElement('button');
        btn.textContent = stitch.name;
        btn.className = 'btn';
        btn.style.margin = '10px';
        btn.addEventListener('click', function() {
          if (stitch.name === correctStitch.name) {
            score++;
            gameResult.textContent = '✅ Correct!';
            gameResult.style.color = 'green';
            if (gameScore) gameScore.textContent = score;
          } else {
            gameResult.textContent = `❌ Wrong! It was ${correctStitch.name}`;
            gameResult.style.color = 'red';
          }
          setTimeout(playRound, 1500);
        });
        gameOptions.appendChild(btn);
      });
    }
  }

  // ===== REVIEWS SYSTEM =====
  const submitReviewBtn = document.getElementById('submitReview');
  if (submitReviewBtn) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    function displayReviews() {
      const reviewsContainer = document.getElementById('reviews');
      if (reviewsContainer) {
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
          const reviewDiv = document.createElement('div');
          reviewDiv.className = 'review';
          reviewDiv.innerHTML = `
            <h3>${review.name}</h3>
            <p>${'⭐'.repeat(review.rating)}</p>
            <p>${review.text}</p>
          `;
          reviewsContainer.appendChild(reviewDiv);
        });
      }
    }

    submitReviewBtn.addEventListener('click', function() {
      const name = document.getElementById('reviewerName')?.value;
      const text = document.getElementById('reviewText')?.value;
      const rating = parseInt(document.getElementById('reviewRating')?.value || 5);

      if (name && text) {
        reviews.push({ name, text, rating });
        localStorage.setItem('reviews', JSON.stringify(reviews));
        document.getElementById('reviewerName').value = '';
        document.getElementById('reviewText').value = '';
        displayReviews();
        alert('Review submitted successfully!');
      } else {
        alert('Please fill in all fields');
      }
    });

    displayReviews();
  }

  // ===== DELIVERY & PAYMENT =====
  const addressForm = document.getElementById('addressForm');
  if (addressForm) {
    const creditCardFields = document.getElementById('creditCardFields');
    const easyPaisaFields = document.getElementById('easyPaisaFields');
    const jazzCashFields = document.getElementById('jazzCashFields');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');

    // Initialize: hide all payment fields
    creditCardFields.style.display = 'none';
    easyPaisaFields.style.display = 'none';
    jazzCashFields.style.display = 'none';

    paymentRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        // Hide all payment fields first
        creditCardFields.style.display = 'none';
        easyPaisaFields.style.display = 'none';
        jazzCashFields.style.display = 'none';

        // Remove required attribute from all fields
        document.getElementById('cardNumber').required = false;
        document.getElementById('cardHolder').required = false;
        document.getElementById('expiryDate').required = false;
        document.getElementById('cvv').required = false;
        document.getElementById('easyPaisaPhone').required = false;
        document.getElementById('jazzCashPhone').required = false;

        // Show the selected payment method fields and make them required
        if (this.value === 'creditCard') {
          creditCardFields.style.display = 'block';
          document.getElementById('cardNumber').required = true;
          document.getElementById('cardHolder').required = true;
          document.getElementById('expiryDate').required = true;
          document.getElementById('cvv').required = true;
        } else if (this.value === 'easyPaisa') {
          easyPaisaFields.style.display = 'block';
          document.getElementById('easyPaisaPhone').required = true;
        } else if (this.value === 'jazzCash') {
          jazzCashFields.style.display = 'block';
          document.getElementById('jazzCashPhone').required = true;
        }
      });
    });

    addressForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      const deliveryData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        homeAddress: document.getElementById('homeAddress').value,
        altAddress: document.getElementById('altAddress').value,
        altPhone: document.getElementById('altPhone').value,
        province: document.getElementById('province').value,
        city: document.getElementById('city').value,
        payment: paymentMethod
      };

      // Add payment-specific details
      if (paymentMethod === 'creditCard') {
        deliveryData.cardNumber = document.getElementById('cardNumber').value;
        deliveryData.cardHolder = document.getElementById('cardHolder').value;
        deliveryData.expiryDate = document.getElementById('expiryDate').value;
        deliveryData.cvv = document.getElementById('cvv').value;
      } else if (paymentMethod === 'easyPaisa') {
        deliveryData.easyPaisaPhone = document.getElementById('easyPaisaPhone').value;
      } else if (paymentMethod === 'jazzCash') {
        deliveryData.jazzCashPhone = document.getElementById('jazzCashPhone').value;
      }

      localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
      
      // Verify data was saved
      const savedData = localStorage.getItem('deliveryData');
      if (savedData) {
        document.getElementById('addressResult').textContent = '✅ Delivery & Payment details saved successfully!';
        document.getElementById('addressResult').style.color = 'green';
        console.log('Delivery data saved to localStorage');

        setTimeout(() => {
          alert('Details saved! Redirecting to cart...');
          window.location.href = 'cart.html';
        }, 1500);
      } else {
        document.getElementById('addressResult').textContent = '⚠️ Error saving details. Please try again.';
        document.getElementById('addressResult').style.color = 'red';
        console.error('Failed to save delivery data');
      }
    });
  }

  // ===== CART PAGE =====
  const placeOrderBtn = document.getElementById('placeOrder');
  if (placeOrderBtn) {
    function displayCart() {
      const cartList = document.getElementById('cartList');
      if (cartList) {
        cartList.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
          const itemDiv = document.createElement('div');
          itemDiv.style.padding = '10px';
          itemDiv.style.borderBottom = '1px solid #ccc';
          itemDiv.innerHTML = `
            <strong>${item.name}</strong> — ₨${item.price}
            <button style="float:right; background:#d9534f; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="removeFromCart(${item.id})">Remove</button>
          `;
          cartList.appendChild(itemDiv);
          total += item.price;
        });

        // Get discount from localStorage
        const discountCoupon = localStorage.getItem('discountCoupon');
        const discountDisplay = document.getElementById('discountDisplay');
        let finalTotal = total;

        if (discountCoupon && discountCoupon === '10% OFF') {
          const discountAmount = (total * 0.1).toFixed(2);
          finalTotal = (total - discountAmount).toFixed(2);
          if (discountDisplay) {
            discountDisplay.textContent = `✅ 10% Discount Applied! You save: ₨${discountAmount}`;
            discountDisplay.style.display = 'block';
          }
        } else {
          if (discountDisplay) {
            discountDisplay.style.display = 'none';
          }
        }

        const totalDiv = document.createElement('div');
        totalDiv.style.fontWeight = 'bold';
        totalDiv.style.marginTop = '20px';
        totalDiv.style.fontSize = '1.2em';
        
        if (discountCoupon && discountCoupon === '10% OFF') {
          totalDiv.innerHTML = `<s style="color: #999;">Original Total: ₨${total}</s><br>Final Total: ₨${finalTotal}`;
        } else {
          totalDiv.textContent = `Total: ₨${total}`;
        }
        
        cartList.appendChild(totalDiv);
      }

      // Display saved delivery and payment details
      const deliveryData = JSON.parse(localStorage.getItem('deliveryData'));
      const savedAddress = document.getElementById('savedAddress');
      const savedPayment = document.getElementById('savedPayment');

      if (deliveryData) {
        // Display delivery address
        savedAddress.innerHTML = `
          <strong>📍 Delivery Address:</strong><br>
          Name: ${deliveryData.fullName}<br>
          Phone: ${deliveryData.phone}<br>
          Email: ${deliveryData.email}<br>
          Address: ${deliveryData.homeAddress}<br>
          ${deliveryData.altAddress ? `Alternative Address: ${deliveryData.altAddress}<br>` : ''}
          ${deliveryData.altPhone ? `Alternative Phone: ${deliveryData.altPhone}<br>` : ''}
          City: ${deliveryData.city}<br>
          Province: ${deliveryData.province}
        `;
        savedAddress.style.color = '#333';

        // Display payment details
        let paymentText = `<strong>💳 Payment Method: </strong>`;
        
        if (deliveryData.payment === 'creditCard') {
          paymentText += `<br>Credit Card<br>Cardholder: ${deliveryData.cardHolder}<br>Card Number: **** **** **** ${deliveryData.cardNumber.slice(-4)}<br>Expiry: ${deliveryData.expiryDate}`;
        } else if (deliveryData.payment === 'easyPaisa') {
          paymentText += `<br>EasyPaisa<br>Phone: ${deliveryData.easyPaisaPhone}`;
        } else if (deliveryData.payment === 'jazzCash') {
          paymentText += `<br>JazzCash<br>Phone: ${deliveryData.jazzCashPhone}`;
        } else if (deliveryData.payment === 'advanceCash') {
          paymentText += `<br>Advance Cash (₨1000 upfront, rest on delivery)`;
        }

        savedPayment.innerHTML = paymentText;
        savedPayment.style.color = '#333';
      }
    }

    placeOrderBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      const deliveryData = JSON.parse(localStorage.getItem('deliveryData'));
      if (!deliveryData) {
        alert('Please add delivery details first!');
        window.location.href = 'delivery.html';
        return;
      }

      // Calculate final total with discount
      let total = 0;
      cart.forEach(item => {
        total += item.price;
      });

      const discountCoupon = localStorage.getItem('discountCoupon');
      let finalTotal = total;
      if (discountCoupon && discountCoupon === '10% OFF') {
        finalTotal = (total - (total * 0.1)).toFixed(2);
      }

      // Create order object
      const orderData = {
        orderId: 'ORD-' + Date.now(),
        orderDate: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: cart,
        subtotal: total,
        discount: discountCoupon === '10% OFF' ? '10%' : 'None',
        finalTotal: finalTotal,
        delivery: deliveryData
      };

      // Store order in order history with verification
      let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
      orderHistory.push(orderData);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      // Verify order was saved
      const savedOrderHistory = JSON.parse(localStorage.getItem('orderHistory'));
      if (!savedOrderHistory || !Array.isArray(savedOrderHistory) || savedOrderHistory.length === 0) {
        console.error('Failed to save order history');
        alert('Error saving order! Please try again.');
        return;
      }
      
      console.log('Order #' + orderData.orderId + ' saved successfully to order history');

      const orderMessage = `
        🎉 Thank you, ${deliveryData.fullName}!
        Your order has been placed successfully.
        We're cooking up something sweet just for you — like a warm slice of crochet cake! 🍰🧶
        Get ready to unwrap your cozy package soon.
        Confirmation has been sent to ${deliveryData.email}. 💌
      `;

      alert(orderMessage);
      
      // Clear cart and delivery data after successful order
      localStorage.removeItem('cart');
      cart = [];
      localStorage.removeItem('deliveryData');
      localStorage.removeItem('discountCoupon');
      
      // Verify data was cleared
      const cartAfterClear = localStorage.getItem('cart');
      const deliveryAfterClear = localStorage.getItem('deliveryData');
      if (!cartAfterClear && !deliveryAfterClear) {
        console.log('Order data cleared successfully');
      }
      
      updateCartCount();
      displayCart();
      
      // Redirect with a small delay to ensure all data is saved
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    });

    displayCart();
  }

  // ===== GALLERY UPLOAD =====
  const uploadInput = document.getElementById('uploadInput');
  const addToGalleryBtn = document.getElementById('addToGallery');
  if (uploadInput && addToGalleryBtn) {
    let gallery = JSON.parse(localStorage.getItem('gallery')) || [];

    function displayGallery() {
      const galleryDiv = document.getElementById('gallery');
      if (galleryDiv) {
        galleryDiv.innerHTML = '';
        gallery.forEach(img => {
          const imgDiv = document.createElement('img');
          imgDiv.src = img;
          galleryDiv.appendChild(imgDiv);
        });
      }
    }

    addToGalleryBtn.addEventListener('click', function() {
      const file = uploadInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          gallery.push(e.target.result);
          localStorage.setItem('gallery', JSON.stringify(gallery));
          displayGallery();
          uploadInput.value = '';
          alert('Image uploaded to gallery!');
        };
        reader.readAsDataURL(file);
      }
    });

    displayGallery();
  }

  // Color picker on product pages
  const colorPickers = document.querySelectorAll('.colorPicker');
  colorPickers.forEach(picker => {
    picker.addEventListener('change', function() {
      const viewer = this.closest('.card').querySelector('.viewer');
      if (viewer) {
        viewer.style.background = this.value;
      }
    });
  });
});

// Remove from cart function
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  location.reload();
}
// ===== PREVIOUS ORDERS PAGE =====
const ordersList = document.getElementById('ordersList');
if (ordersList) {
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
  
  if (orderHistory.length === 0) {
    ordersList.innerHTML = '<p style="text-align: center; color: #999;">No previous orders found. Start shopping!</p>';
  } else {
    ordersList.innerHTML = '';
    orderHistory.forEach((order, index) => {
      const orderCard = document.createElement('div');
      orderCard.className = 'order-card';
      
      let itemsHTML = '';
      order.items.forEach(item => {
        itemsHTML += `
          <div class="order-item">
            <span class="order-item-name">${item.name}</span>
            <span class="order-item-price">₨${item.price}</span>
          </div>
        `;
      });

      const discountText = order.discount !== 'None' ? `<div class="order-total-row"><span>Discount (${order.discount}):</span><span>-₨${(order.subtotal * 0.1).toFixed(2)}</span></div>` : '';

      orderCard.innerHTML = `
        <div class="order-header">
          <div class="order-header-item">
            <div class="order-header-label">Order ID</div>
            <div class="order-header-value">${order.orderId}</div>
          </div>
          <div class="order-header-item">
            <div class="order-header-label">Order Date</div>
            <div class="order-header-value" style="font-size: 1.1em;">${order.orderDate}</div>
          </div>
          <div class="order-header-item">
            <div class="order-header-label">Total Amount</div>
            <div class="order-header-value" style="color: #ff6b6b;">₨${order.finalTotal}</div>
          </div>
        </div>

        <div class="order-items">
          <h4 style="color: #6b4f4f; margin-bottom: 12px; font-size: 1.1em;">Order Items:</h4>
          ${itemsHTML}
        </div>

        <div class="order-total-section">
          <div class="order-total-row">
            <span>Subtotal:</span>
            <span>₨${order.subtotal}</span>
          </div>
          ${discountText}
          <div class="order-total-row final">
            <span>Final Total:</span>
            <span>₨${order.finalTotal}</span>
          </div>
        </div>

        <div class="order-delivery">
          <div class="delivery-label">📦 Delivery Address</div>
          <div class="delivery-detail">
            <strong>${order.delivery.fullName}</strong><br>
            Phone: ${order.delivery.phone}<br>
            Email: ${order.delivery.email}<br>
            Address: ${order.delivery.homeAddress}<br>
            City: ${order.delivery.city}, ${order.delivery.province}<br>
            Payment: ${order.delivery.payment === 'creditCard' ? 'Credit Card' : order.delivery.payment === 'easyPaisa' ? 'EasyPaisa' : order.delivery.payment === 'jazzCash' ? 'JazzCash' : 'Advance Cash'}
          </div>
        </div>
      `;
      
      ordersList.appendChild(orderCard);
    });
  }
}

// ===== DATA PERSISTENCE STATUS =====
function logDataStatus() {
  console.log('=== CROCHET HUB DATA PERSISTENCE STATUS ===');
  
  // Cart status
  const cartData = localStorage.getItem('cart');
  const cartCount = cartData ? JSON.parse(cartData).length : 0;
  console.log(`📦 Cart: ${cartCount} items stored`);
  
  // Order history status
  const orderHistoryData = localStorage.getItem('orderHistory');
  const orderCount = orderHistoryData ? JSON.parse(orderHistoryData).length : 0;
  console.log(`📋 Order History: ${orderCount} orders stored`);
  
  // Delivery data status
  const deliveryData = localStorage.getItem('deliveryData');
  console.log(`📍 Delivery Data: ${deliveryData ? 'Saved' : 'Not saved'}`);
  
  // Discount status
  const discount = localStorage.getItem('discountCoupon');
  console.log(`🎁 Discount Coupon: ${discount || 'None'}`);
  
  // Reviews status
  const reviewsData = localStorage.getItem('reviews');
  const reviewCount = reviewsData ? JSON.parse(reviewsData).length : 0;
  console.log(`⭐ Reviews: ${reviewCount} reviews stored`);
  
  // Gallery status
  const galleryData = localStorage.getItem('gallery');
  const galleryCount = galleryData ? JSON.parse(galleryData).length : 0;
  console.log(`🖼️ Gallery: ${galleryCount} images stored`);
  
  console.log('=== ALL DATA IS AUTOMATICALLY SAVED TO BROWSER STORAGE ===');
  console.log('✅ Your data will persist when you restart the website!');
}

// Log data status on page load
window.addEventListener('load', function() {
  logDataStatus();
});

// Also log when data changes
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  originalSetItem.call(this, key, value);
  if (key.includes('cart') || key.includes('order') || key.includes('delivery') || key.includes('discount')) {
    console.log(`💾 Data saved: ${key}`);
  }
};
