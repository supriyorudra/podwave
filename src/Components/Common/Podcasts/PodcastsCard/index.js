import React from 'react';
import './styles.css'
import { Link } from 'react-router-dom';

const PodcastsCard = ({ id, title, displayImage }) => {
    return (
        <Link to={`podcast/${id}`}>
            <div className='podcast-card'>
                <img className='display-image-podcast' src={displayImage} alt={title} />
                <p className='title-podcast'>{title}</p>
            </div>
        </Link>
    )
}

export default PodcastsCard