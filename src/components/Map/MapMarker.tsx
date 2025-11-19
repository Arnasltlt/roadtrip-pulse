import L from 'leaflet';

// Custom Icon for Playgrounds (Premium)
// Custom Icon Factory for Playgrounds (Premium SVG)
export const getPlaygroundIcon = (isSelected: boolean) => L.divIcon({
    className: 'bg-transparent',
    html: `
    <div class="relative group cursor-pointer transition-all duration-500 ease-out ${isSelected ? 'scale-110 z-50' : 'hover:scale-110 z-10'}">
      
      <!-- Main Marker Body -->
      <div class="relative w-14 h-14 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
        
        <!-- Outer Ring / Glow -->
        <div class="absolute inset-0 rounded-full opacity-40 animate-pulse ${isSelected ? 'bg-explorer-orange-400 blur-md' : 'bg-explorer-teal-400 blur-sm group-hover:blur-md'}"></div>
        
        <!-- Background Circle -->
        <div class="relative w-12 h-12 rounded-full border-[3px] border-white shadow-xl overflow-hidden transition-colors duration-300 ${isSelected ? 'bg-gradient-to-br from-explorer-orange-400 to-explorer-orange-600' : 'bg-gradient-to-br from-explorer-teal-500 to-explorer-teal-700 group-hover:from-explorer-orange-400 group-hover:to-explorer-orange-600'}">
            
            <!-- Icon (SVG) -->
            <div class="absolute inset-0 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 drop-shadow-md">
                    <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z"/>
                    <path d="M9 12V5a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v7"/>
                    <path d="M8 21h8"/>
                </svg>
            </div>
        </div>

        <!-- Pointer / Tail -->
        <div class="absolute top-[90%] left-1/2 transform -translate-x-1/2 -mt-1">
            <div class="w-3 h-3 rotate-45 border-r border-b border-black/10 transition-colors duration-300 ${isSelected ? 'bg-explorer-orange-600' : 'bg-explorer-teal-700 group-hover:bg-explorer-orange-600'}"></div>
        </div>

      </div>
      
      <!-- Shadow on Ground -->
      <div class="absolute top-[60%] left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ${isSelected ? 'opacity-60 scale-125' : 'opacity-30 group-hover:opacity-60'}">
        <div class="w-8 h-1.5 bg-black/40 blur-[2px] rounded-full"></div>
      </div>

    </div>
  `,
    iconSize: [0, 0], // Handled by HTML
    iconAnchor: [0, 0],
    popupAnchor: [0, -32],
});
