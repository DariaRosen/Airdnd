import { useSelector } from "react-redux"
export function AppFooter() {

  const isLoading = useSelector(storeState => storeState.homeModule.isLoading)
  if (isLoading) return
  return (
    <footer className="app-footer full">
      <div className="footer-left">
        <span>© 2025 Airdnd, Inc.</span>
      </div>
      <div className="footer-right">
        <a><i className="fa fa-globe"></i> English (US)</a>
        <a>₪ ILS</a>
      </div>
    </footer>
  )
}
