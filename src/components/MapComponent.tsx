import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon missing issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapComponent({ posts, onClaim }: { posts: any[], onClaim: (id: string) => void }) {
  // Center on Chennai by default
  const center = posts.length > 0 && posts[0].latitude ? [posts[0].latitude, posts[0].longitude] : [13.0827, 80.2707];
  
  return (
    <MapContainer center={center as any} zoom={11} style={{ height: '500px', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {posts.filter(p => p.latitude && p.longitude).map(post => (
        <Marker key={post.id} position={[post.latitude, post.longitude]}>
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h4 className="font-bold text-lg">{post.title}</h4>
              <p className="text-sm text-zinc-600 font-medium mb-1">{post.quantity} - {post.foodType}</p>
              <p className="text-xs text-zinc-500 mb-3">{post.address}</p>
              <button 
                onClick={() => onClaim(post.id)} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white px-3 py-2 rounded-md text-sm font-semibold shadow-sm"
              >
                Claim Donation
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
