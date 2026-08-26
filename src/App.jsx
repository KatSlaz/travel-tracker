import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>TravelTracker</h1>
      </header>

      <main className="main">
        <aside className="sidebar">
          <h2>My Travels</h2>
          <button>Add Location</button>

          <h2>Create group</h2>
        </aside>

        <section className="map">
          <h2>World Map</h2>
        </section>
      </main>
    </div>
  )
}

export default App