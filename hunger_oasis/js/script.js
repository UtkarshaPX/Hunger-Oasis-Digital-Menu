// Menu Items data
const menuItems = [
  {
    id: 1,
    name: "VEG CUTLET",
    price: 120,
    category: "appetizers",
    image: "images/menu/veg-cutlet.jpg",
    description: "Crispy vegetable cutlet made with mixed vegetables and spices",
  },
  {
    id: 2,
    name: "PANEER CUTLET",
    price: 140,
    category: "appetizers",
    image: "images/menu/paneer-cutlet.jpg",
    description: "Crispy paneer cutlet with spices and herbs",
  },
  {
    id: 3,
    name: "CHICKEN CUTLET",
    price: 180,
    category: "appetizers",
    image: "images/menu/chicken-cutlet.jpg",
    description: "Crispy chicken cutlet with aromatic spices",
  },
  {
    id: 4,
    name: "CHICKEN PAKORA",
    price: 250,
    category: "appetizers",
    image: "images/menu/chicken-pakora.jpg",
    description: "Crispy deep-fried chicken fritters with spices",
  },
  {
    id: 5,
    name: "GREEN SALAD",
    price: 80,
    category: "salads",
    image: "images/menu/green-salad.jpg",
    description: "Fresh garden vegetables served with a tangy dressing",
  },
  {
    id: 6,
    name: "PLAIN CURD",
    price: 60,
    category: "salads",
    image: "images/menu/plain-curd.jpg",
    description: "Freshly made creamy yogurt",
  },
  {
    id: 7,
    name: "MIX RAITA",
    price: 80,
    category: "salads",
    image: "images/menu/mix-raita.jpg",
    description: "Yogurt with mixed vegetables and spices",
  },
  {
    id: 8,
    name: "PANEER TIKKA",
    price: 210,
    category: "tandoor-veg",
    image: "images/menu/paneer-tikka.jpg",
    description: "Marinated cottage cheese cubes grilled in tandoor",
  },
  {
    id: 9,
    name: "PANEER MALAI TIKKA",
    price: 250,
    category: "tandoor-veg",
    image: "images/menu/paneer-malai-tikka.jpg",
    description: "Creamy cottage cheese cubes grilled in tandoor",
  },
  {
    id: 10,
    name: "CHICKEN TANDOORI",
    price: 380,
    category: "tandoor-non-veg",
    image: "images/menu/chicken-tandoori.jpg",
    description: "Classic tandoori chicken marinated in yogurt and spices",
  },
  {
    id: 11,
    name: "CHICKEN TIKKA",
    price: 250,
    category: "tandoor-non-veg",
    image: "images/menu/chicken-tikka.jpg",
    description: "Boneless chicken pieces marinated and grilled in tandoor",
  },
  {
    id: 12,
    name: "CHICKEN MALAI TIKKA",
    price: 280,
    category: "tandoor-non-veg",
    image: "images/menu/chicken-malai-tikka.jpg",
    description: "Creamy boneless chicken pieces grilled in tandoor",
  },
  {
    id: 13,
    name: "VEG CHOWMEIN",
    price: 100,
    category: "chinese-veg",
    image: "images/menu/veg-chowmein.jpg",
    description: "Stir-fried noodles with mixed vegetables",
  },
  {
    id: 14,
    name: "PANEER CHOWMEIN",
    price: 140,
    category: "chinese-veg",
    image: "images/menu/paneer-chowmein.jpg",
    description: "Stir-fried noodles with cottage cheese and vegetables",
  },
  {
    id: 15,
    name: "CHICKEN CHOWMEIN",
    price: 140,
    category: "chinese-non-veg",
    image: "images/menu/chicken-chowmein.jpg",
    description: "Stir-fried noodles with chicken and vegetables",
  },
  {
    id: 16,
    name: "CHICKEN FRIED RICE",
    price: 160,
    category: "rice-non-veg",
    image: "images/menu/chicken-fried-rice.jpg",
    description: "Stir-fried rice with chicken and vegetables",
  },
  {
    id: 17,
    name: "VEG FRIED RICE",
    price: 130,
    category: "rice-veg",
    image: "images/menu/veg-fried-rice.jpg",
    description: "Stir-fried rice with mixed vegetables",
  },
  {
    id: 18,
    name: "PANEER FRIED RICE",
    price: 150,
    category: "rice-veg",
    image: "images/menu/paneer-fried-rice.jpg",
    description: "Stir-fried rice with cottage cheese and vegetables",
  },
  {
    id: 19,
    name: "DAL FRY",
    price: 80,
    category: "dal",
    image: "images/menu/dal-fry.jpg",
    description: "Yellow lentils tempered with spices",
  },
  {
    id: 20,
    name: "DAL MAKHANI",
    price: 120,
    category: "dal",
    image: "images/menu/dal-makhani.jpg",
    description: "Black lentils and kidney beans in a creamy tomato sauce",
  },
  {
    id: 21,
    name: "TANDOORI ROTI",
    price: 15,
    category: "indian-breads",
    image: "images/menu/tandoori-roti.jpg",
    description: "Whole wheat bread baked in tandoor",
  },
  {
    id: 22,
    name: "BUTTER NAN",
    price: 60,
    category: "indian-breads",
    image: "images/menu/butter-nan.jpg",
    description: "Leavened bread topped with butter",
  },
  {
    id: 23,
    name: "SPECIAL VEG THALI",
    price: 220,
    category: "thali",
    image: "images/menu/veg-thali.jpg",
    description: "Complete vegetarian meal with rice, bread, curry, dal, and dessert",
  },
  {
    id: 24,
    name: "SPECIAL NON-VEG THALI",
    price: 250,
    category: "thali",
    image: "images/menu/non-veg-thali.jpg",
    description: "Complete non-vegetarian meal with rice, bread, curry, dal, and dessert",
  },
]

// Add this at the beginning of the file, after the menuItems array
// Load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Initialize Razorpay
async function initRazorpay() {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    alert("Razorpay SDK failed to load. Check your internet connection.")
    return false
  }
  return true
}

// Call this when the page loads
initRazorpay()

// DOM elements
const menuItemsContainer = document.getElementById("menu-items")
const categoryBtns = document.querySelectorAll(".category-btn")
const cartIcon = document.getElementById("cart-icon")
const cartBadge = document.getElementById("cart-badge")
const cartSidebar = document.getElementById("cart-sidebar")
const closeCart = document.getElementById("close-cart")
const cartItems = document.getElementById("cart-items")
const emptyCartMessage = document.getElementById("empty-cart-message")
const cartSubtotal = document.getElementById("cart-subtotal")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const continueShoppingBtn = document.getElementById("continue-shopping")
const mobileMenuButton = document.getElementById("mobile-menu-button")
const mobileMenu = document.getElementById("mobile-menu")
const tableNumberInput = document.getElementById("table-number")
const checkoutModal = document.getElementById("checkout-modal")
const closeCheckoutModal = document.getElementById("close-checkout-modal")
const paymentForm = document.getElementById("payment-form")
const upiFields = document.getElementById("upi-fields")
const cardFields = document.getElementById("card-fields")
const confirmationModal = document.getElementById("confirmation-modal")
const closeConfirmation = document.getElementById("close-confirmation")
const orderNumber = document.getElementById("order-number")

// Cart data
let cart = []
let currentCategory = "all"

// Initialize the menu
function initMenu() {
  displayMenuItems(currentCategory)
  updateCartBadge()
}

// Display menu items based on category
function displayMenuItems(category) {
  menuItemsContainer.innerHTML = ""

  const filteredItems = category === "all" ? menuItems : menuItems.filter((item) => item.category === category)

  if (filteredItems.length === 0) {
    menuItemsContainer.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i class="fas fa-search text-4xl mb-4 text-gray-500"></i>
                <p class="text-gray-400">No items found in this category</p>
            </div>
        `
    return
  }

  filteredItems.forEach((item) => {
    const menuCard = document.createElement("div")
    menuCard.className = "menu-card bg-dark-light rounded-lg overflow-hidden shadow-lg border border-gray-800"

    menuCard.innerHTML = `
            <div class="h-48 overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" 
                    onerror="this.src='https://via.placeholder.com/400x300?text=Hunger+Oasis'">
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-medium">${item.name}</h3>
                    <span class="gold-text font-bold">₹${item.price}</span>
                </div>
                <p class="text-gray-400 text-sm mb-4">${item.description}</p>
                <button class="add-to-cart-btn w-full px-4 py-2 rounded-md btn-outline-gold font-medium flex items-center justify-center" 
                    data-id="${item.id}">
                    <i class="fas fa-plus mr-2"></i>
                    Add to Cart
                </button>
            </div>
        `

    menuItemsContainer.appendChild(menuCard)
  })

  // Add event listeners to the newly created "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", addToCart)
  })
}

// Filter menu items by category
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    currentCategory = btn.dataset.category
    displayMenuItems(currentCategory)
  })
})

// Add to cart functionality
function addToCart(e) {
  const itemId = Number.parseInt(e.currentTarget.dataset.id)
  const item = menuItems.find((item) => item.id === itemId)

  const existingItem = cart.find((cartItem) => cartItem.id === itemId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })
  }

  updateCart()
  updateCartBadge()
  openCart()

  // Show "Added to cart" feedback
  const btn = e.currentTarget
  const originalText = btn.innerHTML
  btn.innerHTML = '<i class="fas fa-check mr-2"></i>Added'
  btn.classList.remove("btn-outline-gold")
  btn.classList.add("btn-gold")

  setTimeout(() => {
    btn.innerHTML = originalText
    btn.classList.remove("btn-gold")
    btn.classList.add("btn-outline-gold")
  }, 1500)
}

// Update cart display
function updateCart() {
  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden")
    cartItems.innerHTML = ""
    checkoutBtn.disabled = true
  } else {
    emptyCartMessage.classList.add("hidden")
    checkoutBtn.disabled = false

    cartItems.innerHTML = ""
    cart.forEach((item) => {
      const cartItem = document.createElement("div")
      cartItem.className = "flex items-center justify-between p-4 border-b border-gray-800"

      cartItem.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md mr-4" 
                        onerror="this.src='https://via.placeholder.com/64?text=HO'">
                    <div>
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-sm text-gray-400">₹${item.price} × ${item.quantity}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <span class="mr-4 font-medium gold-text">₹${item.price * item.quantity}</span>
                    <div class="flex items-center space-x-2">
                        <button class="decrease-quantity w-8 h-8 flex items-center justify-center rounded-md bg-dark border border-gray-700" 
                            data-id="${item.id}">
                            <i class="fas fa-minus text-sm"></i>
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button class="increase-quantity w-8 h-8 flex items-center justify-center rounded-md bg-dark border border-gray-700" 
                            data-id="${item.id}">
                            <i class="fas fa-plus text-sm"></i>
                        </button>
                        <button class="remove-item w-8 h-8 flex items-center justify-center rounded-md bg-dark border border-gray-700 ml-2" 
                            data-id="${item.id}">
                            <i class="fas fa-trash-alt text-sm text-red-500"></i>
                        </button>
                    </div>
                </div>
            `

      cartItems.appendChild(cartItem)
    })

    // Calculate and display totals
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const total = subtotal // Add tax or delivery charges if needed

    cartSubtotal.textContent = `₹${subtotal}`
    cartTotal.textContent = `₹${total}`

    // Add event listeners to the newly created buttons in cart items
    document.querySelectorAll(".decrease-quantity").forEach((btn) => {
      btn.addEventListener("click", decreaseQuantity)
    })

    document.querySelectorAll(".increase-quantity").forEach((btn) => {
      btn.addEventListener("click", increaseQuantity)
    })

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", removeItem)
    })
  }
}

// Decrease item quantity
function decreaseQuantity(e) {
  const itemId = Number.parseInt(e.currentTarget.dataset.id)
  const item = cart.find((item) => item.id === itemId)

  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    removeItem(e)
    return
  }

  updateCart()
  updateCartBadge()
}

// Increase item quantity
function increaseQuantity(e) {
  const itemId = Number.parseInt(e.currentTarget.dataset.id)
  const item = cart.find((item) => item.id === itemId)

  item.quantity += 1

  updateCart()
  updateCartBadge()
}

// Remove item from cart
function removeItem(e) {
  const itemId = Number.parseInt(e.currentTarget.dataset.id)
  cart = cart.filter((item) => item.id !== itemId)

  updateCart()
  updateCartBadge()
}

// Update cart badge
function updateCartBadge() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  if (totalItems > 0) {
    cartBadge.textContent = totalItems
    cartBadge.classList.remove("hidden")
  } else {
    cartBadge.classList.add("hidden")
  }
}

// Open cart sidebar
function openCart() {
  cartSidebar.classList.remove("translate-x-full")
  document.body.style.overflow = "hidden"
}

// Close cart sidebar
function closeCartSidebar() {
  cartSidebar.classList.add("translate-x-full")
  document.body.style.overflow = "auto"
}

// Event Listeners
cartIcon.addEventListener("click", openCart)
closeCart.addEventListener("click", closeCartSidebar)
continueShoppingBtn.addEventListener("click", closeCartSidebar)

// Checkout process
checkoutBtn.addEventListener("click", () => {
  const tableNumber = tableNumberInput.value.trim()

  if (!tableNumber) {
    tableNumberInput.classList.add("ring-2", "ring-red-500")
    tableNumberInput.focus()

    // Remove error highlight after 3 seconds
    setTimeout(() => {
      tableNumberInput.classList.remove("ring-2", "ring-red-500")
    }, 3000)

    return
  }

  // Show checkout modal
  checkoutModal.classList.remove("hidden")
})

// Close checkout modal
closeCheckoutModal.addEventListener("click", () => {
  checkoutModal.classList.add("hidden")
})

// Toggle payment fields
document.querySelectorAll('input[name="payment-method"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "upi") {
      upiFields.classList.remove("hidden")
      cardFields.classList.add("hidden")
    } else if (e.target.value === "card") {
      cardFields.classList.remove("hidden")
      upiFields.classList.add("hidden")
    } else {
      upiFields.classList.add("hidden")
      cardFields.classList.add("hidden")
    }
  })
})

// Handle payment form submission
paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value
  const orderType = document.querySelector('input[name="order-type"]:checked')?.value

  if (!paymentMethod) {
    // Show error message
    return
  }

  // Create the order object
  const orderData = {
    items: cart,
    total: Number.parseFloat(cartTotal.textContent.replace("₹", "")),
    table_no: tableNumberInput.value,
    payment_method: paymentMethod,
    order_type: orderType,
    status: "pending",
  }

  // Disable the submit button
  const submitBtn = document.getElementById("place-order-btn")
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...'

  try {
    if (paymentMethod === "razorpay") {
      // Create order on server first
      const response = await fetch("backend/create_order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to create order")
      }

      // Initialize Razorpay payment
      const options = {
        key: "rzp_test_YOUR_KEY_HERE", // Replace with your Razorpay key
        amount: data.amount, // Amount in paise
        currency: "INR",
        name: "Hunger Oasis",
        description: "Food Order Payment",
        order_id: data.razorpay_order_id,
        handler: (response) => {
          // Handle successful payment
          verifyPayment(response, data.order_id)
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#d4af37",
        },
        modal: {
          ondismiss: () => {
            // Reset button
            submitBtn.disabled = false
            submitBtn.innerHTML = "Place Order"
          },
        },
      }

      const razorpay = new Razorpay(options)
      razorpay.open()
    } else {
      // Cash on delivery - directly place order
      await sendOrder(orderData)
    }
  } catch (error) {
    console.error("Payment error:", error)
    alert("Payment failed: " + error.message)

    // Reset button
    submitBtn.disabled = false
    submitBtn.innerHTML = "Place Order"
  }
})

// Verify payment with server
async function verifyPayment(paymentData, orderId) {
  try {
    const response = await fetch("backend/verify_payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        order_id: orderId,
      }),
    })

    const data = await response.json()

    if (data.status === "success") {
      // Show confirmation
      showOrderConfirmation(orderId)
    } else {
      throw new Error(data.message || "Payment verification failed")
    }
  } catch (error) {
    console.error("Verification error:", error)
    alert("Payment verification failed: " + error.message)
  } finally {
    // Reset button
    const submitBtn = document.getElementById("place-order-btn")
    submitBtn.disabled = false
    submitBtn.innerHTML = "Place Order"

    // Close checkout modal
    checkoutModal.classList.add("hidden")
  }
}

// Show order confirmation
function showOrderConfirmation(orderId) {
  document.querySelector("#order-number span").textContent = orderId

  // Close checkout modal and show confirmation
  checkoutModal.classList.add("hidden")
  confirmationModal.classList.remove("hidden")

  // Clear cart after successful order
  cart = []
  updateCart()
  updateCartBadge()
}

// Send order to backend (for cash on delivery)
async function sendOrder(orderData) {
  try {
    const response = await fetch("backend/place_order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const data = await response.json()

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to place order")
    }

    // Show confirmation
    showOrderConfirmation(data.order_id)
  } catch (error) {
    console.error("Order error:", error)
    alert("Failed to place order: " + error.message)
  } finally {
    // Reset button
    const submitBtn = document.getElementById("place-order-btn")
    submitBtn.disabled = false
    submitBtn.innerHTML = "Place Order"

    // Close checkout modal
    checkoutModal.classList.add("hidden")
  }
}

// Close confirmation modal
closeConfirmation.addEventListener("click", () => {
  confirmationModal.classList.add("hidden")
  closeCartSidebar()
})

// Mobile menu toggle
mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden")
})

// Initialize the menu when the page loads
window.addEventListener("DOMContentLoaded", initMenu)

// Placeholder image error handling
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName.toLowerCase() === "img") {
      e.target.src = "https://via.placeholder.com/400x300?text=Hunger+Oasis"
    }
  },
  true,
)
