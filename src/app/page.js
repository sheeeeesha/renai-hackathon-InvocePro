
import Link from 'next/link';

const Home = () => (
  <div>
    <h1>Welcome to the Home Page</h1>
    <Link href="/auth">Go to Authenticate</Link>
  </div>
);

export default Home;
