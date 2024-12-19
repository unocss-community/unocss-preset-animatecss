import { createApp } from 'vue'
import 'uno.css'

createApp({
  setup() {
    return () => (
      <div class="bg-secondary duration-300 flex h-full w-full items-center justify-center">
        <div class="bg-white text-pink-3 text-4xl animate__zoomInUp animate__animated animate__delay-0.5s">
          UnPreset Animate.CSS
        </div>
      </div>
    )
  },
}).mount('#app')
