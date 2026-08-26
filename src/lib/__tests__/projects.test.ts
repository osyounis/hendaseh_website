import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { getAllProjects, getFeaturedProjects, getProjectById } from '../projects'
import { ProjectsFileSchema } from '../projectSchema'
import projectsData from '../../data/projects.json'
import { getProjectHref, getShowcaseProjects } from '../projects'

describe('getAllProjects', () => {
  it('should return all projects', () => {
    const projects = getAllProjects()
    expect(projects).toBeDefined()
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('should return projects with required fields', () => {
    const projects = getAllProjects()
    projects.forEach(project => {
      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('title')
      expect(project).toHaveProperty('description')
      expect(project).toHaveProperty('technologies')
      expect(project).toHaveProperty('featured')
    })
  })
})

describe('getFeaturedProjects', () => {
  it('should return only featured projects', () => {
    const featured = getFeaturedProjects()
    expect(Array.isArray(featured)).toBe(true)
    featured.forEach(project => {
      expect(project.featured).toBe(true)
    })
  })

  it('should return a subset of all projects', () => {
    const allProjects = getAllProjects()
    const featured = getFeaturedProjects()
    expect(featured.length).toBeLessThanOrEqual(allProjects.length)
  })
})

describe('getProjectById', () => {
  it('should return a project when valid id is provided', () => {
    const project = getProjectById('collision-avoidance-radar')
    expect(project).toBeDefined()
    expect(project?.id).toBe('collision-avoidance-radar')
  })

  it('should return undefined when invalid id is provided', () => {
    const project = getProjectById('non-existent-project')
    expect(project).toBeUndefined()
  })

  it('should return project with correct structure', () => {
    const project = getProjectById('collision-avoidance-radar')
    expect(project).toHaveProperty('id')
    expect(project).toHaveProperty('title')
    expect(project).toHaveProperty('description')
    expect(project).toHaveProperty('technologies')
  })
})

describe('projects.json schema v2', () => {
  it('validates against ProjectsFileSchema', () => {
    const parsed = ProjectsFileSchema.safeParse(projectsData)
    expect(parsed.success, JSON.stringify(parsed.success ? '' : parsed.error.issues, null, 2)).toBe(true)
  })

  it('has exactly one flagship (nahtadi) with detailPath /nahtadi', () => {
    const flagships = getAllProjects().filter(p => p.tier === 'flagship')
    expect(flagships.map(p => p.id)).toEqual(['nahtadi'])
    expect(flagships[0].detailPath).toBe('/nahtadi')
  })
})

describe('getProjectHref', () => {
  it('returns null for card tier', () => {
    const card = getAllProjects().find(p => p.tier === 'card')!
    expect(getProjectHref(card)).toBeNull()
  })
  it('returns /projects/<id> for showcase tier without detailPath', () => {
    const sc = getAllProjects().find(p => p.tier === 'showcase' && !p.detailPath)!
    expect(getProjectHref(sc)).toBe(`/projects/${sc.id}`)
  })
  it('returns detailPath when set', () => {
    expect(getProjectHref(getProjectById('nahtadi')!)).toBe('/nahtadi')
  })
})

describe('getShowcaseProjects', () => {
  it('returns only showcase-tier projects', () => {
    const s = getShowcaseProjects()
    expect(s.length).toBeGreaterThan(0)
    s.forEach(p => expect(p.tier).toBe('showcase'))
  })
})

describe('project assets', () => {
  it('every project image path resolves to a real file in public/', () => {
    getAllProjects().forEach((p) => {
      expect(p.image, p.id).toBeDefined()
      expect(existsSync(`public${p.image}`), `${p.id}: ${p.image}`).toBe(true)
    })
  })

  // The asset engine (see docs/ROADMAP.md, "Adding a project's assets")
  // deterministically generates four outputs per project from one committed
  // artwork PNG. This is the assertion the docs advertise as "keeps you
  // honest" — it fails if any of the four goes missing for any project.
  it('every project has all four generated asset files', () => {
    const outputs = ['icon.png', 'icon-squircle.png', 'card.png', 'github-banner.png']
    getAllProjects().forEach((p) => {
      outputs.forEach((file) => {
        const assetPath = `public/images/projects/${p.id}/${file}`
        expect(existsSync(assetPath), `${p.id}: missing ${file}`).toBe(true)
      })
    })
  })
})
