# Tour of Go

## Packages, Variables, Functions

- Packages
    - every program starts running in package main
    - `import` adds the listed paths inside the file. now all the packages inside those paths can be referenced directly by name
        - package name is same as the last element of the import path
- Variables
    - variable / function is auto exported if it’s name starts with a capital letter
- Functions
    - format: `func add (x int, y int) int {return x + y}`
    - if two parameters share a type, we can just keep it in the last
    - a function can return any number of arguments: e.g.: `func swap (x, y int) (int, int) {return y, x}`
    - go allows `Named Returns`
        - As long as we have the return variable names in the function declaration, we don’t need to explicitly return them. just calling return is sufficient
        - use is discouraged except in very short functions
    - `var` allows us to declare and initialize a list of variables.
        - can be used at both package / function levels
        - IN CASE OF DECLARATIONS, all variables declared in one `var` statement must be of the same type
        - var statement can include initializer. if initializer is present, we can exclude type, and it would be autoassigned
        - if not initialized, all variables auto initialize to the `zero value` for the specific types
        - inside function scope, `var` can be replaced by shorthand `:=` symbol which uses type inference
        - variable declaration may be factored into blocks
            - this gives us all possible permutations of types and initialized vs non initialized values
    - Types
        - Basic Types:
            - bool
            - string
            - int (8 → 64) . regular is an alias of 32 / 64 depending upon register size
            - uint (8 → 64) . regular is an alias of 32 / 64 depending upon register size
            - byte (alias of uint8)
            - rune (alias of int32)
                - in Go, a string is a sequence of bytes. however, because of special characters, some characters can span over multiple bytes. so it’s important to use typecasting when reading through strings to correctly get the rune (character) representation instead of raw bytes.

                ```go
                s := "Hello, 世界"
                bytes := []bytes(s)
                runes := []rune(s)
                ```

                - by default, the for range loop splits a string into a bunch of runes.
                - however using string[x] will return a byte

            - float (32 → 64)
            - complex (64 → 128)

        - inside `fmt.printf` , `%T` represents the Type of the variable, while `%v` represents the Value.
            - Similar to C, `%c` , `%d` etc can be used to typecast the result into different types while printing.
                - %c ⇒ rune, %d ⇒ int
        - typecasting: `T(v)` where T is type
            - e.g.: `f := float64(42)`
            - unlike C, assignments between different types requires explicit conversion. e.g.: int → float

    - Constants
        - `const` keyword
        - require explicit `=` symbol. not `:=`
        - Numeric Constants (high precision bit constants) e.g. `const small = 1>>100`

## Flow control statements: for, if, else, switch and defer

- For
    - Go only uses for loops. no explicit while / do while.

    ```go
    sum := 0
    for i := 0; i < 10; i++ {
        sum += i
    }

    // range
    for index, value := range x {
        ...
    }
    ```

    - init ; conditional ; post
    - init / post statements are optional
        - in this case we can just remove the semi colons.
        - so this becomes same as the while loop in C
        - we can also completely eliminate conditions to always stay in loop

- if
    - regular if
    - shorthand if clause: init ; condition
        - variables declared in init are also available in else clause
- switch
    - `break` statement after each case is not needed in go. it’s auto included
    - can also add an init clause here
    - switch with no condition
- defer
    - defers the execution of a function until remaining function completes
    - the call args are evaluated immediately, but the execution is done later
    - multiple defers are always pushed on a stack

## More types: structs, slices, and maps

- pointers
    - `&variableName` ⇒ generates a pointer
    - `*pointer` ⇒ read underlying value through pointer (dereferencing)
    - unlike C, go does not have pointer arithmetic
- struct : collection of fields

    ```go
    type Vertex struct {
        X int
        Y int
    }

    v := Vertex{1, 2}
    ```

    - We can have pointers to structs
    - go allows dereferencing struct pointers without explicit `*`
        - so `(*p).field` & `p.field` are both equivalent
    - struct literal
        - unlike C, there is no new keyword. creation happens directly via struct literal
        - initialization:
            - we can either pass the list of args, or supply named args
            - named args allow all possible permutations of initializing fields
            - by default all fields are initialized to their corresponding `zero values`
        - we can use the `&` prefix on the struct literal to get the pointer
    - zero value of a struct is the recursive zero value for all fields.

- arrays
    - type: `[n]T`
    - since array’s length is part of it’s type, it cannot be resized
    - can be initialized directly: `x := [2]int{1, 2}`
    - zero value: zero value of underlying type
- slice : dynamically sized, flexible view into an array
    - type: `[]T`
        ```go
        x := [5]int{1, 2, 3, 4, 5}
        var y []int = x[1:4]
        ```
    - the higher / lower bounds can be omitted. However, negative values are not allowed
    - slices are references (pointers) to underlying arrays.
        - so updating a slice, also updates the array, and all slices on top of that array
    - slice literal
        - e.g.: `x := []bool{true, false}`
        - creates the array, and then builds a slice that references it
    - slice has both length `len(s)` and capacity `cap(s)`
        - length: number of elements inside the slice
        - capacity: number of elements in the underlying array, counting from first element in the slice
    - slice can be sliced infinitely, while always pointing to the same underlying array.
        - conditions:
            - `index_start_new ≥ index_start_old`
            - `index_end_old ≤ capacity_old`
    - zero value of a slice is `nil` (since it behaves like a pointer)
        - nil slice has a length and capacity of 0, and has no underlying array
    - `make` : builtin function used to create slices & maps
        - `x := make([]int, length, capacity)`
            - capacity is optional. defaults to length
        - array is initialized to zero value for each element
    - slices of slices.
        - 2D / 3D slice creation is same as in C++, but with `make` inside nested loops
    - appending to a slice
        - `func append(s []T, vs ...T) []T`
        - **works on nil slices as well**
        - if capacity is available, it adds to the same array.
        - otherwise create a new array and return it’s reference.
    - range: used in for loops to iterate over slices / maps
        - `i, v := range s`
        - i ⇒ index, v ⇒ copy of the element
- Maps
    - zero value: nil. unlike slices, nil maps cannot do anything. they require initialization
    - type: map[T]V
        - V can be any type.
        - T can be any `comparable` type.
            - primitive types, arrays, pointers, interfaces and structs (with recursively comparable field types) are comparable.
            - slices, maps, functions are not.
    - initialization via make: `m := make(map[string]Vertex)`
    - map literals are like struct literals.
        - during use, struct literal is not explicitly required to be mentioned
    - mutations:
        - delete: `delete(m, key)`
        - test if key is present: `elem, ok := m[key]`
            - by default, elem will always return a value. if key doesn’t exist, then elem is zero value.
            - ok is boolean. if false, then key is not in map
- functions
    - functions in go can be used as value (function arguments and return values)

    ```go
    // function as variable
    hypot := func(x, y float64) float64 {
        return math.Sqrt(x*x + y*y)
    }

    // function as arguments
    func compute(fn func(float64, float64) float64) float64 {
        return fn(3, 4)
    }
    ```

    - function closures

    ```go
    func adder() func(int) int {
        sum := 0
        return func(x int) int {
            sum += x
            return sum
        }
    }

    func main() {
        pos, neg := adder(), adder()
        for i := 0; i < 10; i++ {
            fmt.Println(
                pos(i),
                neg(-1*i),
            )
        }
    }
    ```

## Methods and Interfaces

- methods : functions, but with a receiver argument

    ```go
    func (v Vertex) Abs() int {
        return v.X*v.X + v.Y*v.Y
    }
    ```

    - methods can be defined on non struct types too
        - we can only add methods to types defined in the same package. to bypass, we can replicate the other / builtin type to a custom one and add methods to it
        - `type MyFloat float64`
    - receiver types:
        - value receiver : pass as copy
        - pointer receiver : pass by reference
    - methods and pointer indirection
        - golang auto figures out whether to do pass by reference / value depending upon how method is defined
    - methods, like struct fields can be called from pointer / value without explicit dereferencing

- interfaces: set of method signatures

    ```go
    type Abser interface {
        Abs() float64
    }

    var a Abser
    a = x // custom type which implements interface
    ```

    - interface differentiates between methods using pointer receiver vs value receiver
        > interesting case: if the interface requires receivers without pointers, then technically, the pointer itself can inherit the interface
    - Interfaces are implemented implicitly
        - there is no `~~implements~~` keyword in go. this decouples the implementations from the definition. and they can now be in different packages without referencing each other.
    - under the hood, interface is a tuple of `(value, type)`
        - Zero value: `<nil>, <nil>`
            - cannot call anything on a nil interface. (runtime error)
    - If the concrete value inside the interface variable is nil, then any method that is called, will be called with a nil receiver.
        - This is allowed in Go. and we can always have the pointer receiver == nil condition inside any function.
    - the empty interface: `interface{}`
        - this may hold values of any type. used by code that handled values of unknown type.

        ```go
        func main() {
            var i interface{}
            i = 42
            i = "hello"
            describe(i)
        }

        func describe(i interface{}) {
            fmt.Printf("(%v, %T)\n", i, i)
        }
        ```

- **extended inheritance in structs and interfaces:**
    - **interface can just extend another interface by mentioning it’s name directly inside.**
    - **same for structs**
- Type assertions
    - `t := i.(T)` asserts that the interface i holds the concrete type T and assigns the underlying T value.
    - if i doesn’t hold T, then it causes panic.
    - `t, ok := i.(T)` doesn’t cause panic. if i doesn’t hold T, then `ok == false` , and `t == zero value of T`
        - this syntax is similar to that of reading from a map
    - type switches: go construct that permits several type assertions in series
    ```go
    switch v := i.(type) {
    case T:
        //
    case S:
        //
    default:
        //
    }
    ```
- `Stringer` : builtin interface defined in `fmt` package.
    - used by fmt when printing variable of that type
    - underlying function: `String() string`
    - String creation can be done via : fmt.Sprintf()
- `error` : builtin interface defined in `fmt` package
    - underlying function: `Error() string`
    - functions with try catch, usually return an optional error interface value as additional return type. and the calling code should check if err is nil or not.
    - error creation can be done via fmt.Errorf()
- io package

## Generics

- generic functions: `func Index[T comparable](s []T, x T) int {...}`
- generic types: `type List[T any] struct {...}`

## Concurrency

- goroutines
    - `go <function call>`
    - the function arguments are derived in the old thread. the function execution takes place in the new thread
    - goroutines can share address namespace. so need to think about race conditions when using same references / objects.
        - useful primitives in `sync` package
        - more common to use `channels` tho
- channels
    - `make(chan, T, <optional. buffer size>)`
    - `ch <- v` , `v := <- ch`
    - channels can be closed
        - should only be closed via sender. and only required to close if the receiver needs to know.
        - sending / reading from a closed channel throws.
        - correct way to read:
            - `val, ok := <- ch`
            - `for i := range ch` → this will terminate loop once channel is closed
- Select
    - acts like a switch statement, which waits for different goroutines in parallel.
    - usually run alongside a timer case (`time.After(2 * time.Second)`)
    - can use a default case to make it nonblocking
- Mutex
    - type: `sync.Mutex`
    - functions: Lock() / Unlock()
    - initially, it’s unlocked. Lock blocks until the lock has been unlocked

# Go Project Structure

folders:

- cmd: main entrypoints
- internal: domain logic
- pkg: imported dependencies / binaries
-

# Design Patterns & Refactoring
