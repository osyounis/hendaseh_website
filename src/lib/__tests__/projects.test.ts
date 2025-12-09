import { describe, it, expect } from 'vitest'
import { getAllProjects, getFeaturedProjects, getProjectById } from '../projects'

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
