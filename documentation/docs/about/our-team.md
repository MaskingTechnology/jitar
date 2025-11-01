---
layout: page
title: Our team
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
    desc: 'Experienced full-stack architect. Done with building APIs for the wrong reasons.',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/petermasking' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/petervvliet/' }
    ]
  },
  {
    avatar: 'https://github.com/basmasking.png',
    name: 'Bas Meeuwissen',
    title: 'Co-author',
    desc: 'Experienced low-code architect. Knows the true meaning of automation.',
    links: [
      { icon: 'github', link: 'https://github.com/basmasking' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/basmeeuwissen/' }
    ]
  },
  {
    avatar: 'https://github.com/johnmasking.png',
    name: 'John Meeuwissen',
    title: 'QA',
    desc: 'Experienced integration specialist. Yoda like testing and breaking skills.',
    links: [
      { icon: 'github', link: 'https://github.com/johnmasking' },
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
