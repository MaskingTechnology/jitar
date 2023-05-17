---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://github.com/petermasking.png',
    name: 'Peter van Vliet',
    desc: 'An experienced full stack developer with many years of experience. He’s built many applications in many different languages, with many different frameworks.',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/petermasking' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/petervvliet/' }
    ]
  },
  {
    avatar: 'https://github.com/BasMasking.png',
    name: 'Bas Meeuwissen',
    title: 'Co-author',
    desc: 'An experienced low-code developer with many years of experience on the pega platform. He’s worked for some of the larger corporations in the Netherlands and is used to building for scale.',
    links: [
      { icon: 'github', link: 'https://github.com/BasMasking' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/basmeeuwissen/' }
    ]
  },
  {
    avatar: 'https://github.com/JohnatMasking.png',
    name: 'John Meeuwissen',
    title: 'QA',
    desc: 'An experienced integration specialist..',
    links: [
      { icon: 'github', link: 'https://github.com/JohnatMasking' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/john-meeuwissen-0a880a9/' }
    ]
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers size="small"
    :members="members"
  />
</VPTeamPage>
