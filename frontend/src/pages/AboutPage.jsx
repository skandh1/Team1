import { Link } from "react-router-dom";

function AboutPage() {
    return (
        <div className="about-container">
            <h1>Welcome to Our Platform</h1>
            <p>
                This platform helps users connect, post projects, chat, and grow together.
                Whether you&apos;re looking for collaboration, learning, or networking, you&apos;re in the right place.
            </p>
            <Link to="/login">
                <button>Login</button>
            </Link>
        </div>
    );
}

export default AboutPage;
