document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const ordersContainer = document.getElementById("orders-container")
  const orderDetailsModal = document.getElementById("order-details-modal")
  const closeDetailsModal = document.getElementById("close-details-modal")
  const modalOrderId = document.getElementById("modal-order-id")
  const modalOrderTime = document.getElementById("modal-order-time")
  const modalOrderType = document.getElementById("modal-order-type")
  const modalOrderItems = document.getElementById("modal-order-items")
  const updateStatusBtn = document.getElementById("update-status-btn")
  const orderFilterBtns = document.querySelectorAll(".order-filter-btn")
  const statusBtns = document.querySelectorAll(".status-btn")
  const notificationArea = document.getElementById("notification-area")
  const newOrderSound = document.getElementById("new-order-sound")
  const statusUpdateSound = document.getElementById("status-update-sound")
  const autoRefreshToggle = document.getElementById("auto-refresh")
  const refreshStatus = document.getElementById("refresh-status")
  const pendingCount = document.getElementById("pending-count")
  const preparingCount = document.getElementById("preparing-count")
  const readyCount = document.getElementById("ready-count")
  const deliveredCount = document.getElementById("delivered-count")

  // Current selected order and filter
  let currentOrderId = null
  let currentFilter = "all"
  let currentSelectedStatus = null
  let lastOrderId = 0
  let refreshInterval = null
  const refreshTime = 10 // seconds
  let orders = []

  // Set current date and time
  const currentDate = document.getElementById("current-date")
  const currentTime = document.getElementById("current-time")

  function updateDateTime() {
    const now = new Date()
    currentDate.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    currentTime.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  updateDateTime()
  setInterval(updateDateTime, 1000)

  // Initialize auto-refresh
  function initAutoRefresh() {
    if (autoRefreshToggle.checked) {
      refreshInterval = setInterval(fetchOrders, refreshTime * 1000)
      refreshStatus.textContent = `ON (${refreshTime}s)`
      document.querySelector(".dot").classList.add("translate-x-5")
    } else {
      clearInterval(refreshInterval)
      refreshStatus.textContent = "OFF"
      document.querySelector(".dot").classList.remove("translate-x-5")
    }
  }

  // Toggle auto-refresh
  autoRefreshToggle.addEventListener("change", initAutoRefresh)

  // Format time elapsed since order
  function formatTimeElapsed(orderTime) {
    const now = new Date()
    const orderDate = new Date(orderTime)
    const elapsedMs = now - orderDate
    const elapsedMinutes = Math.floor(elapsedMs / 60000)
    const elapsedHours = Math.floor(elapsedMinutes / 60)

    if (elapsedMinutes < 1) {
      return { text: "Just now", minutes: 0 }
    } else if (elapsedMinutes === 1) {
      return { text: "1 minute ago", minutes: 1 }
    } else if (elapsedMinutes < 60) {
      return { text: `${elapsedMinutes} minutes ago`, minutes: elapsedMinutes }
    } else if (elapsedHours === 1) {
      return { text: "1 hour ago", minutes: elapsedMinutes }
    } else {
      return { text: `${elapsedHours} hours ago`, minutes: elapsedMinutes }
    }
  }

  // Format absolute time
  function formatAbsoluteTime(timeString) {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fetch orders from the server
  function fetchOrders() {
    // Show loading if it's the first load
    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="pulse text-center text-gray-400 py-12 col-span-full">
            <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
            <p>Loading orders...</p>
        </div>
      `
    }

    // Fetch orders from the backend
    fetch("backend/get_orders.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.status === "success") {
          // Check for new orders
          const newOrders = data.orders.filter((order) => {
            // Find the highest order ID to track new orders
            if (Number.parseInt(order.id) > lastOrderId) {
              lastOrderId = Number.parseInt(order.id)
              return true
            }
            return false
          })

          // Notify about new orders
          if (newOrders.length > 0 && orders.length > 0) {
            newOrders.forEach((order) => {
              showNotification(`New Order #${order.id}`, "New order received!", "success")
            })
            playSound(newOrderSound)
          }

          // Check for status updates
          if (orders.length > 0) {
            data.orders.forEach((newOrder) => {
              const existingOrder = orders.find((o) => o.id === newOrder.id)
              if (existingOrder && existingOrder.status !== newOrder.status) {
                showNotification(
                  `Order #${newOrder.id} Updated`,
                  `Status changed from ${capitalizeFirstLetter(existingOrder.status)} to ${capitalizeFirstLetter(newOrder.status)}`,
                  "info",
                )
                playSound(statusUpdateSound)
              }
            })
          }

          // Update orders array
          orders = data.orders

          // Update status counts
          updateStatusCounts(orders)

          // Display orders
          displayOrders(orders)
        } else {
          console.error("Error fetching orders:", data.message)
          showNotification("Error", "Failed to fetch orders. Please check the console.", "error")
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error)
        showNotification("Error", "Failed to fetch orders. Please check the console.", "error")
      })
  }

  // Update status counts
  function updateStatusCounts(orders) {
    const counts = {
      pending: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
    }

    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++
      }
    })

    pendingCount.textContent = counts.pending
    preparingCount.textContent = counts.preparing
    readyCount.textContent = counts.ready
    deliveredCount.textContent = counts.delivered
  }

  // Play sound
  function playSound(audioElement) {
    if (audioElement) {
      audioElement.currentTime = 0
      audioElement.play().catch((e) => console.log("Audio play error:", e))
    }
  }

  // Show notification
  function showNotification(title, message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification bg-dark-light border-l-4 p-4 mb-4 shadow-lg transform transition-all duration-300 ease-in-out translate-x-full`

    // Set border color based on type
    if (type === "success") {
      notification.classList.add("border-green-500")
    } else if (type === "error") {
      notification.classList.add("border-red-500")
    } else {
      notification.classList.add("border-gold")
    }

    notification.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-medium">${title}</h3>
          <p class="text-sm text-gray-400">${message}</p>
        </div>
        <button class="close-notification text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `

    notificationArea.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full")
    }, 10)

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)

    // Close button
    notification.querySelector(".close-notification").addEventListener("click", () => {
      notification.classList.add("translate-x-full")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })
  }

  // Display orders in the UI
  function displayOrders(orders) {
    let filteredOrders = orders

    // Apply filter if not 'all'
    if (currentFilter !== "all") {
      filteredOrders = orders.filter((order) => order.status === currentFilter)
    }

    if (filteredOrders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="text-center text-gray-400 py-12 col-span-full">
            <i class="fas fa-clipboard-list text-3xl mb-4"></i>
            <p>No orders found</p>
        </div>
      `
      return
    }

    ordersContainer.innerHTML = ""

    // Sort orders: pending first, then preparing, then ready, then by time (newest first)
    filteredOrders.sort((a, b) => {
      const statusOrder = { pending: 0, preparing: 1, ready: 2, delivered: 3 }
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }
      return new Date(b.time) - new Date(a.time)
    })

    filteredOrders.forEach((order) => {
      const formattedTime = formatAbsoluteTime(order.time)
      const timeElapsed = formatTimeElapsed(order.time)

      const orderCard = document.createElement("div")
      orderCard.className = "order-card bg-dark-light rounded-lg overflow-hidden shadow-lg border border-gray-800"

      // Set border color based on status
      if (order.status === "pending") {
        orderCard.classList.add("border-yellow-600")
      } else if (order.status === "preparing") {
        orderCard.classList.add("border-blue-600")
      } else if (order.status === "ready") {
        orderCard.classList.add("border-green-600")
      } else if (order.status === "delivered") {
        orderCard.classList.add("border-gray-600", "opacity-75")
      }

      // Add urgent class for orders waiting more than 15 minutes
      if (order.status === "pending" && timeElapsed.minutes > 15) {
        orderCard.classList.add("animate-pulse", "border-red-600")
      }

      const itemsList = order.items
        .map(
          (item) =>
            `<div class="flex justify-between">
                <span>${item.quantity}× ${item.name}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>`,
        )
        .join("")

      orderCard.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-medium">Order #${order.id}</h3>
                    <div class="flex items-center text-sm text-gray-400">
                        <span>${formattedTime}</span>
                        <span class="mx-2">•</span>
                        <span class="${order.status === "pending" && timeElapsed.minutes > 15 ? "text-red-400 font-medium" : ""}">${timeElapsed.text}</span>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}">
                    ${capitalizeFirstLetter(order.status)}
                </span>
            </div>
            
            <div class="mb-4">
                <p class="text-sm font-medium mb-2">
                    ${
                      order.order_type === "dine-in"
                        ? `<i class="fas fa-utensils mr-2"></i>Dine-in • Table ${order.table_no}`
                        : `<i class="fas fa-shopping-bag mr-2"></i>Takeaway`
                    }
                </p>
                
                <div class="text-sm text-gray-400 space-y-1 max-h-20 overflow-y-auto mb-2">
                    ${itemsList}
                </div>
                
                <div class="flex justify-between font-medium mt-2">
                    <span>Total:</span>
                    <span class="gold-text">₹${order.total}</span>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button class="view-order-btn flex-1 px-4 py-2 rounded-md btn-outline-gold font-medium flex items-center justify-center" 
                    data-id="${order.id}">
                    <i class="fas fa-eye mr-2"></i>
                    Details
                </button>
                ${
                  order.status === "pending"
                    ? `
                <button class="quick-prepare-btn flex-1 px-4 py-2 rounded-md bg-blue-900 text-blue-300 border border-blue-700 font-medium flex items-center justify-center hover:bg-blue-800" 
                    data-id="${order.id}">
                    <i class="fas fa-fire-alt mr-2"></i>
                    Start
                </button>
                `
                    : ""
                }
                ${
                  order.status === "preparing"
                    ? `
                <button class="quick-ready-btn flex-1 px-4 py-2 rounded-md bg-green-900 text-green-300 border border-green-700 font-medium flex items-center justify-center hover:bg-green-800" 
                    data-id="${order.id}">
                    <i class="fas fa-check mr-2"></i>
                    Ready
                </button>
                `
                    : ""
                }
                ${
                  order.status === "ready"
                    ? `
                <button class="quick-deliver-btn flex-1 px-4 py-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 font-medium flex items-center justify-center hover:bg-gray-600" 
                    data-id="${order.id}">
                    <i class="fas fa-check-circle mr-2"></i>
                    Deliver
                </button>
                `
                    : ""
                }
            </div>
        </div>
      `

      ordersContainer.appendChild(orderCard)
    })

    // Add event listeners to the buttons
    document.querySelectorAll(".view-order-btn").forEach((btn) => {
      btn.addEventListener("click", viewOrderDetails)
    })

    document.querySelectorAll(".quick-prepare-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => quickUpdateStatus(e, "preparing"))
    })

    document.querySelectorAll(".quick-ready-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => quickUpdateStatus(e, "ready"))
    })

    document.querySelectorAll(".quick-deliver-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => quickUpdateStatus(e, "delivered"))
    })
  }

  // Quick update status without opening modal
  function quickUpdateStatus(e, status) {
    const orderId = Number.parseInt(e.currentTarget.dataset.id)

    // Show loading state
    const originalText = e.currentTarget.innerHTML
    e.currentTarget.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Updating...'
    e.currentTarget.disabled = true

    // Send update to backend
    updateOrderStatus(orderId, status)
      .then(() => {
        // Refresh orders after update
        fetchOrders()
      })
      .catch((error) => {
        console.error("Error updating status:", error)
        showNotification("Error", "Failed to update order status", "error")

        // Reset button
        e.currentTarget.innerHTML = originalText
        e.currentTarget.disabled = false
      })
  }

  // Update order status in the backend
  function updateOrderStatus(orderId, status) {
    const updateData = {
      order_id: orderId,
      status: status,
    }

    return fetch("backend/update_order_status.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data.status === "success") {
          return data
        } else {
          throw new Error(data.message || "Failed to update order status")
        }
      })
  }

  // Get status CSS class
  function getStatusClass(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300"
      case "preparing":
        return "bg-blue-900 text-blue-300"
      case "ready":
        return "bg-green-900 text-green-300"
      case "delivered":
        return "bg-gray-900 text-gray-300"
      default:
        return "bg-gray-900 text-gray-300"
    }
  }

  // Capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // View order details
  function viewOrderDetails(e) {
    const orderId = Number.parseInt(e.currentTarget.dataset.id)
    currentOrderId = orderId

    // Find the order in our cached data
    const order = orders.find((o) => Number.parseInt(o.id) === orderId)

    if (!order) return

    modalOrderId.textContent = `#${order.id}`

    // Format the order time
    const orderTime = new Date(order.time)
    const formattedTime = orderTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    modalOrderTime.textContent = formattedTime

    modalOrderType.textContent = order.order_type === "dine-in" ? `Dine-in • Table ${order.table_no}` : `Takeaway`

    // Display order items
    modalOrderItems.innerHTML = ""
    order.items.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "flex justify-between"

      itemElement.innerHTML = `
        <div>
            <span class="font-medium">${item.quantity}×</span> ${item.name}
        </div>
        <span>₹${item.price * item.quantity}</span>
      `

      modalOrderItems.appendChild(itemElement)
    })

    // Set the current status
    currentSelectedStatus = order.status

    // Update status buttons
    updateStatusButtons(order.status)

    // Show the modal
    orderDetailsModal.classList.remove("hidden")
  }

  // Update status buttons
  function updateStatusButtons(status) {
    statusBtns.forEach((btn) => {
      btn.classList.remove("bg-dark-darker", "text-white")

      if (btn.dataset.status === status) {
        btn.classList.add("bg-dark-darker", "text-white")
      }
    })
  }

  // Close order details modal
  closeDetailsModal.addEventListener("click", () => {
    orderDetailsModal.classList.add("hidden")
    currentOrderId = null
  })

  // Status button click
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      statusBtns.forEach((b) => b.classList.remove("bg-dark-darker", "text-white"))
      btn.classList.add("bg-dark-darker", "text-white")

      currentSelectedStatus = btn.dataset.status
    })
  })

  // Update order status
  updateStatusBtn.addEventListener("click", () => {
    if (!currentOrderId || !currentSelectedStatus) return

    // Show loading state
    updateStatusBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Updating...'
    updateStatusBtn.disabled = true

    // Send update to backend
    updateOrderStatus(currentOrderId, currentSelectedStatus)
      .then(() => {
        // Close the modal
        orderDetailsModal.classList.add("hidden")
        updateStatusBtn.innerHTML = "Update Status"
        updateStatusBtn.disabled = false

        // Refresh orders after update
        fetchOrders()

        // Reset current selected order
        currentOrderId = null
      })
      .catch((error) => {
        console.error("Error updating status:", error)
        showNotification("Error", "Failed to update order status", "error")

        // Reset button
        updateStatusBtn.innerHTML = "Update Status"
        updateStatusBtn.disabled = false
      })
  })

  // Filter orders
  orderFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      orderFilterBtns.forEach((b) => b.classList.remove("active", "btn-gold"))
      orderFilterBtns.forEach((b) => b.classList.add("btn-outline-gold"))

      btn.classList.remove("btn-outline-gold")
      btn.classList.add("active", "btn-gold")

      currentFilter = btn.dataset.filter
      displayOrders(orders) // Use cached orders for filtering
    })
  })

  // Initialize auto-refresh
  initAutoRefresh()

  // Initial fetch
  fetchOrders()
})
