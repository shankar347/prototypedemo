import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { PRODUCTS, ADDRESSES, ORDERS } from '../data/mockData'

const AppContext = createContext(null)
const TRY_BUY_LIMIT = 3
const FASHION_CATEGORIES = ['men', 'women', 'kids', 'accessories', 'footwear', 'fragrances', 'sports', 'oversized', 'streetwear', 'ethnic', 'luxury']

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [addresses, setAddresses] = useState(ADDRESSES)
  const [orders, setOrders] = useState(ORDERS)
  const [toast, setToast] = useState('')
  const [promo, setPromo] = useState(null)
  const [storeMode, setStoreModeState] = useState(() => sessionStorage.getItem('storeMode') || 'fashion')
  const [tryBuyAcknowledged, setTryBuyAcknowledged] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState('express')

  const setStoreMode = useCallback((mode) => {
    setStoreModeState(mode)
    sessionStorage.setItem('storeMode', mode)
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }, [])

  const selectedAddress = addresses.find((a) => a.default) || addresses[0] || null
  const locationReady = Boolean(selectedAddress)

  const tryBuyCount = cart.reduce(
    (sum, item) => sum + (item.product.belongsToDarkStore ? item.qty : 0),
    0,
  )
  const hasTryBuyItems = tryBuyCount > 0

  const addToCart = (product, size, color, qty = 1, options = {}) => {
    const tryBuy = Boolean(options.tryBuy && product.belongsToDarkStore)
    if (product.belongsToDarkStore) {
      const currentDarkStoreQty = cart.reduce(
        (sum, item) => sum + (item.product.belongsToDarkStore ? item.qty : 0),
        0,
      )
      if (currentDarkStoreQty + qty > TRY_BUY_LIMIT) {
        showToast('You can add a maximum of 3 Try & Buy products.')
        return false
      }
    }
    setCart((prev) => {
      const key = `${product.id}-${size}-${color}-buy`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        const nextQty = existing.qty + qty
        if (product.belongsToDarkStore) {
          const otherDarkStore = prev.reduce(
            (sum, i) => sum + (i.key !== key && i.product.belongsToDarkStore ? i.qty : 0),
            0,
          )
          if (otherDarkStore + nextQty > TRY_BUY_LIMIT) {
            showToast('You can add a maximum of 3 Try & Buy products.')
            return prev
          }
        }
        return prev.map((i) => (i.key === key ? { ...i, qty: nextQty } : i))
      }
      return [...prev, { key, product, size, color, qty, tryBuy }]
    })
    showToast('Added to cart')
    return true
  }

  const updateQty = (key, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.key === key)
      if (!item) return prev
      const nextQty = item.qty + delta
      if (nextQty <= 0) return prev.filter((i) => i.key !== key)
      if (item.product.belongsToDarkStore) {
        const otherDarkStore = prev.reduce(
          (sum, i) => sum + (i.key !== key && i.product.belongsToDarkStore ? i.qty : 0),
          0,
        )
        if (otherDarkStore + nextQty > TRY_BUY_LIMIT) {
          showToast('You can add a maximum of 3 Try & Buy products.')
          return prev
        }
      }
      return prev.map((i) => (i.key === key ? { ...i, qty: nextQty } : i))
    })
  }

  const removeFromCart = (key) => setCart((prev) => prev.filter((i) => i.key !== key))

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [product, ...prev],
    )
  }

  const trackRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => [
      product,
      ...prev.filter((item) => item.id !== product.id),
    ].slice(0, 8))
  }

  const clearCart = () => {
    setCart([])
    setPromo(null)
    setTryBuyAcknowledged(false)
    setDeliveryOption('express')
  }

  const fashionProducts = PRODUCTS.filter(
    (p) => !p.belongsToDarkStore && FASHION_CATEGORIES.includes(p.category),
  )
  const darkStoreProducts = PRODUCTS.filter((p) => p.belongsToDarkStore)
  const visibleProducts = storeMode === 'darkstore' ? darkStoreProducts : fashionProducts

  const linePrice = (item) => {
    const useTryBuyPrice = deliveryOption === 'trybuy' && item.product.belongsToDarkStore
    const unit = useTryBuyPrice
      ? (item.product.tryAndBuyPrice || item.product.price)
      : item.product.price
    return unit * item.qty
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + linePrice(i), 0)
  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 49
  const discount = promo === 'TEAL100' ? 100 : promo === 'SUMMER20' ? Math.round(subtotal * 0.2) : promo === 'FREESHIP' ? delivery : 0
  const total = Math.max(0, subtotal + delivery - discount)

  const placeOrder = (payment) => {
    if (hasTryBuyItems && deliveryOption === 'trybuy' && !tryBuyAcknowledged) {
      showToast('Please acknowledge Try & Buy terms before placing the order.')
      return null
    }
    const addr = selectedAddress
    const newOrder = {
      id: `ORD-${Math.floor(20000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart.map((c) => ({
        title: c.product.title,
        brand: c.product.brand,
        qty: c.qty,
        price: deliveryOption === 'trybuy' && c.product.belongsToDarkStore
          ? c.product.tryAndBuyPrice || c.product.price
          : c.product.price,
        tryBuy: deliveryOption === 'trybuy' && c.product.belongsToDarkStore,
      })),
      amount: total,
      payment,
      status: 'Placed',
      eta: '35 mins',
      steps: ['Placed', 'Packed', 'Picked Up', 'Out for Delivery', 'Delivered'],
      stepIndex: 0,
      address: addr,
      tryBuy: hasTryBuyItems && deliveryOption === 'trybuy',
    }
    setOrders((o) => [newOrder, ...o])
    clearCart()
    showToast('Order placed successfully')
    return newOrder
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      recentlyViewed,
      trackRecentlyViewed,
      cartCount,
      subtotal,
      delivery,
      discount,
      total,
      promo,
      setPromo,
      addresses,
      setAddresses,
      orders,
      setOrders,
      placeOrder,
      toast,
      showToast,
      products: PRODUCTS,
      fashionProducts,
      darkStoreProducts,
      visibleProducts,
      storeMode,
      setStoreMode,
      locationReady,
      selectedAddress,
      tryBuyCount,
      hasTryBuyItems,
      tryBuyAcknowledged,
      setTryBuyAcknowledged,
      tryBuyLimit: TRY_BUY_LIMIT,
      deliveryOption,
      setDeliveryOption,
    }),
    [
      user,
      cart,
      wishlist,
      recentlyViewed,
      cartCount,
      subtotal,
      delivery,
      discount,
      total,
      promo,
      addresses,
      orders,
      toast,
      showToast,
      storeMode,
      setStoreMode,
      locationReady,
      selectedAddress,
      tryBuyCount,
      hasTryBuyItems,
      tryBuyAcknowledged,
      fashionProducts,
      darkStoreProducts,
      visibleProducts,
      deliveryOption,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
