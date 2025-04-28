import { assets } from "../assets/assets"
import NewsletterBox from "../components/NewsletterBox"
import Title from "../components/Title"

const About = () => {
    return (
        <div>
            <div className="text-2xl text-center pt-8 border-t">
                <Title text1="ABOUT" text2="US" />
            </div>

            <div className="my-10 flex flex-col md:flex-row gap-16">
                <img className="w-full md:max-w-[450px]" src={assets.about_img} alt="" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente temporibus, incidunt, enim accusantium et obcaecati hic unde natus error quasi magnam voluptas ex rerum, quidem in. Cum dolorum unde vero.
                        Dicta provident soluta assumenda eaque corrupti pariatur illum porro accusamus sequi numquam excepturi harum quaerat voluptatibus, voluptas in nostrum enim doloribus aliquam nam quas libero dolorem, aliquid cupiditate. Quam, provident.</p>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio sed commodi est ullam, sunt illum minima architecto tenetur itaque a, rerum accusantium earum id nesciunt corrupti eligendi harum omnis. Laborum.</p>
                    <b className="text-gray-800">Our Mission</b>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus nihil officia ipsa quasi animi numquam optio laborum! Perferendis consequatur perspiciatis voluptatibus incidunt illum? Harum, ratione fuga eaque earum iste recusandae?</p>
                </div>
            </div>

            <div className="text-xl py-4">
                <Title text1="WHY" text2="CHOOSE US" />
            </div>

            <div className="flex flex-col md:flex-row text-sm mb-20">
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Quality Assurance:</b>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore perferendis, eos libero distinctio cupiditate necessitatibus, magnam harum laborum eum obcaecati ex mollitia adipisci, iure corporis aspernatur ipsam fugiat odio voluptatem!</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Convenience:</b>
                    <p className="text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum inventore consequuntur voluptate non molestiae perferendis reiciendis ab, quas nulla? Inventore recusandae facilis eos deleniti ad qui, commodi veniam voluptatum voluptatibus!</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Exeptional Customer Service:</b>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maiores reprehenderit enim ut cupiditate odit adipisci, quidem magnam deserunt, similique reiciendis dolor! Assumenda, culpa at aperiam accusamus iste ipsam a.</p>
                </div>
            </div>

            <NewsletterBox />
        </div>
    )
}

export default About
