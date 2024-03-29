﻿# 面向对象的特性有哪些?

**抽象**：抽象是指从特定的角度出发，从已经存在的一些事物中抽取我们所关注的特性、行为，从而形成一个新的事物的思维过程，是一种从复杂到简洁的思维方式。

**封装**：封装是指将对象的实现细节隐藏起来，然后通过公共的方法来向外暴露出该对象的功能。

**继承**：继承是面向对象实现软件复用的重要手段，当子类继承父类后，子类是一种特殊的父类，能直接或间接获得父类里的成员。

**多态**：多态简而言之就是同一个行为具有多个不同表现形式或形态的能力。

# 面向对象和面向过程的区别？

你的程序要完成一个任务，相当于讲一个故事。
面向过程：编年体；
面向对象：纪传体。

**面向过程**：面向过程是一种站在过程的角度思考问题的思想，强调的是功能行为，功能的执行过程，即先干啥，后干啥。最小的程序单元是函数，每个函数负责完成某一个功能，整个软件系统由一个个的函数组成，其中作为程序入口的函数称之为主函数，主函数依次调用其他函数，普通函数之间可以相互调用，从而实现整个系统功能。但是设计不够直观，与人类的习惯思维不一致。

**面向对象**：面向对象是一种基于面向过程的新的编程思想，是一种站在对象的角度思考问题的思想，我们把多个功能合理的放到不同对象里，强调的是具备某些功能的对象。面向对象更加符合我们常规的思维方式。

# JDK 和 JRE 的区别是什么？

**Java 运行时环境（JRE-Java Runtime Environment）** 它包括 Java 虚拟机、Java 核心类库和支持文件，但并不包含开发工具——编译器、调试器等。

**Java 开发工具包（JDK-Java Development Kit）** 是完整的 Java 软件开发工具集，包含了JRE、编译器、调试器等以及其他的工具（比如JavaDoc），可以让开发者开发、编译、执行 Java 应用程序。

# 修饰符访问权限由大到小是什么？

类成员
public：任何情况
protected：同包，子类也可以
default、package: 同包，子类不行
private: 只能自己

类只能用public或default修饰(不指定)

# 8个基本数据类型？

分别占几个字节？int和Integer的区别？其他long和Long等的同理。

| int | short | long | char | float | double | boolean   | byte |
| --- | ----- | ---- | ---- | ----- | ------ | --------- | ---- |
| 4   | 2     | 8    | 2    | 4     | 8      | 1     | 1    |
