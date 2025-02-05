import Image from "next/image"
import { Heading } from "@/components/heading"

interface TeamMember {
  name: string
  role: string
  image: string
  linkedin: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Ota Janda",
    role: "CEO",
    image: "/images/team/ota_janda.png",
    linkedin: "https://www.linkedin.com/in/ota-janda-a0997470/",
  },
  {
    name: "Michal Balcar",
    role: "CMO",
    image: "/images/team/michal_balcar.png",
    linkedin: "https://www.linkedin.com/in/michal-balcar/",
  },
  {
    name: "Aleš Roleček",
    role: "CSO",
    image: "/images/team/ales_rolecek.png",
    linkedin: "https://www.linkedin.com/in/ale%C5%A1-role%C4%8Dek-67883b141/",
  },
  {
    name: "Ankit Singhal",
    role: "Advisor",
    image: "/images/team/ankit_singhal.png",
    linkedin: "https://www.linkedin.com/in/ankit9999/",
  },
]

export default function OurTeam() {
  return (
    <section className="py-12 text-white">
      <Heading className="mb-8 text-center text-4xl font-bold lg:text-6xl">Our Team</Heading>
      <p className="mx-auto mb-12 max-w-5xl text-center max-w-[90%] md:max-w-[1140px]">
        Help Gary is a project of the European crypto exchange Coingarage, and this is our team. We are driven by
        passion and a shared vision to make a meaningful impact in the crypto space. Together, we combine creativity,
        dedication, and expertise to bring HelpGary.com to the top.
      </p>

      {/* Full-width container centered */}
      <div className="mx-auto w-full md:max-w-[1140px] max-w-[90%]">
        <div className="grid grid-cols-2 gap-x-4 md:gap-x-16 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="w-full rounded-3xl bg-[#0D1E35] p-6 text-center shadow-lg lg:rounded-lg"
            >
              <div className="relative mx-auto mb-4 h-24 w-24 md:h-32 md:w-32">
                <Image src={member.image} alt={member.name} className="rounded-full" fill />
              </div>
              <Heading className="mb-2 text-xl font-bold">
                <span style={{ WebkitTextStroke: "0px hsl(var(--gary-blue))", paintOrder: "fill" }}>{member.name}</span>
              </Heading>
              <p className="font-bold text-gary-pink">{member.role}</p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 30 30"
                  className="fill-[#ffffff] text-white transition-colors hover:text-blue-700"
                >
                  <path d="M9,25H4V10h5V25z M6.501,8C5.118,8,4,6.879,4,5.499S5.12,3,6.501,3C7.879,3,9,4.121,9,5.499C9,6.879,7.879,8,6.501,8z M27,25h-4.807v-7.3c0-1.741-0.033-3.98-2.499-3.98c-2.503,0-2.888,1.896-2.888,3.854V25H12V9.989h4.614v2.051h0.065 c0.642-1.18,2.211-2.424,4.551-2.424c4.87,0,5.77,3.109,5.77,7.151C27,16.767,27,25,27,25z"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
