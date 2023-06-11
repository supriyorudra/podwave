import Header from "../Components/Common/Header"
import CreatePodcastForm from "../Components/StartAPodcast"

const CreateAPodcast = () => {
  return (
    <div>
        <Header />
        <div className="input-wrapper">
            <h1>Create a Podcast</h1>
            <CreatePodcastForm />
        </div>
    </div>
  )
}

export default CreateAPodcast