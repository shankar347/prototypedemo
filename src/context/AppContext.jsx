import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { PRODUCTS, ADDRESSES, ORDERS } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [addresses, setAddresses] = useState(ADDRESSES)
  const [orders, setOrders] = useState(ORDERS)
  const [toast, setToast] = useState('')
  const [promo, setPromo] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }, [])

  const addToCart = (product, size, color, qty = 1) => {
    setCart((prev) => {
      const key = `${product.id}-${size}-${color}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { key, product, size, color, qty }]
    })
    showToast('Added to cart')
  }

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    )
  }

  const removeFromCart = (key) => setCart((prev) => prev.filter((i) => i.key !== key))

  const clearCart = () => {
    setCart([])
    setPromo(null)
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 49
  const discount = promo === 'TEAL100' ? 100 : promo === 'SUMMER20' ? Math.round(subtotal * 0.2) : promo === 'FREESHIP' ? delivery : 0
  const total = Math.max(0, subtotal + delivery - discount)

  const placeOrder = (payment) => {
    const addr = addresses.find((a) => a.default) || addresses[0]
    const newOrder = {
      id: `ORD-${Math.floor(20000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart.map((c) => ({ title: c.product.title, brand: c.product.brand, qty: c.qty, price: c.product.price })),
      amount: total,
      payment,
      status: 'Placed',
      eta: '35 mins',
      steps: ['Placed', 'Packed', 'Picked Up', 'Out for Delivery', 'Delivered'],
      stepIndex: 0,
      address: addr,
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
    }),
    [user, cart, cartCount, subtotal, delivery, discount, total, promo, addresses, orders, toast, showToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
