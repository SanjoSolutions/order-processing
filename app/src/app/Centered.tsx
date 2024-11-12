export function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="container h-100">
      <div className="row justify-center align-items-center h-100">
        <div className="col col-md-6">{children}</div>
      </div>
    </div>
  )
}
