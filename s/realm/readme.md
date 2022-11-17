
# 👔 uniform ecs

*it's a typescript entity-component-system, for videogames*

- write an interface describing the types for all of the components in your game
  ```ts
  export interface Components {
    count: number
  }
  ```
- now you can create a uniform ecs context
  ```ts
  const uniform = uniformEcsContext<Components>()
  uniform.systems.add(counter, reporter)
  uniform.entities.add({count: 100})
  ```
- whenever you like, you can execute all the systems
  ```ts
  uniformEcs.executeAllSystems()
  ```
