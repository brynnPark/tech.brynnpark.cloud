// src/tech_posts/Post2.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'ISA: Insruction Set Architecture (1)';

const postContent = `
이 글은 컴퓨터 구조 수업에서 다루는 MIPS ISA에 대한 개요와 함께, 명령어 포맷(R/I/J), 레지스터 구조, 메모리 접근 방식 등을 상세히 설명하고, C 코드가 MIPS 어셈블리 코드로 변환되는 과정을 예제로 살펴본다. 또한 조건문과 반복문을 MIPS로 구현하는 방식과 Logical Operation, Branch Instruction 설계 원칙 등을 소개한다.

# 1. Overview of MIPS ISA

- 컴퓨터 구조 수업에서 굉장히 중요한 부분을 차지하는 ISA
- 컴퓨터 구조 수업 자체가 컴퓨터 프로그램과 컴퓨터 하드웨어가 어떻게 서로 소통을 해서 프로그램이 하드웨어 위에서 동작하는 지 그 원리에 대해서 배우는 수업
    - 여기서 ISA가 HW와 프로그램 사이의 interface를 정의하는 구조 → 중요한 부분

## **MIPS Instruction Set Architecture**

- MIPS ⇒ ISA의 종류 중 하나로 우리가 case study할 것

- **Computer Systems Stack**

![image1.png](./images/post6/1.png)
- ISA와 Microarchitecture가 HW의 최상단 layer에 있음 → sw와 hw를 연결시키는 interface역할
- application이 hw의 변화를 drive하고, computer architecture 또한 sw의 변화를 도모함 :서로 상호작용
    
    sw의 발전: application을 기반으로 발전
    
    hw의 발전: application의 특징을 기반으로 hw도 발전
    

- **Computer Architecture**
    - **Instruction Set Architecture (ISA)**
        - Define the interface between HW and SW
        - Hard to change due to compatibility issues
            
            일방적으로 interface가 바뀌면 한 쪽이 못알아들음. 따라서 호환성 이슈로 인해 변경되기 어려움
            
            이로 인해 legacy ISA인 Intel X86과 같은 것들은 최신의 컴퓨터에서도 지원해줌
            
            함부로 없애면 예전에 만들어놨던 program code를 동작시킬 수 없음 ⇒ 무거워진다는 단점
            
        - Various ISAs from chip vendors • x86, ARM, SPARC, etc.
            
            common한 ISA있으면 좋지만 회사 각자 독자적인 ISA가지고 있음
            
    - **Microarchitecture**
        - **Implementation of ISA**
            
            각 회사마다 같은 ISA(예:X86)를 바탕으로 다른 processor 만들 수 있음
            
        - Organization of processors (and I/O subsystems)
        - Examples
            - Depth of pipelines
            - Cache sizes and organization
        
        processors의 구성, io시스템, Depth of pipelines … 이런 게 다르게 구성되기 때문에 성능이 다를 수 있음
        
    ## Operation of Computer Hardware

- **Instruction Set**
    - The repertoire of instructions of a computer
    - Different computers have different instruction sets
        - But with many aspects in common
    - Early computers had very simple instruction sets
        - Simplified implementation
    - Many modern computers also have simple instruction sets
        
        기본적으로 간단한 ISA를 가지고 있지만 성능을 optimize하기 위해 굉장히 복잡한 ISA도 가지고 있음
        
- MIPS Instruction Set [ISA의 한 종류]
    - Large share of embedded core market: 임베디드에 많이 쓰임
    - Typical of many modern ISAs: 현대의 많은 ISA와 비슷함

- **Arithmetic Operations**
    - Add and subtract, three operands
        - Two sources and one destination
            
            \`\`\`bash
            add a,b,c // a=b+c [add = opcode, 나머지: operand]
            sub a,b,c // a=b-c [a: dest, b,c: source]
            \`\`\`

    - All arithmetic operations have this form
    - **Design Principle 1: Simplicity favors regularity**
        - Regularity makes implementation simpler : 규칙성 덕에 구현하기 간단
        - Simplicity enables higher performance at lower cost : 간결성 덕에 적은 비용으로 성능 최적화
- **Arithmetic Example**
    - C code  **\`f = (g+h) - (i+j);\`**
    - Compiled MIPS code (assembly)	g,h같은 변수 사실 $s0 이런 식으로 써야함
        
        \`\`\`bash
        add $t0, g, h # temp t0 = g + h  // 연산결과를 임의로 t0라는 공간에 넣어줌
        add $t1, i, j # temp t1 = i + j  // 연산결과를 임의로 t1라는 공간에 넣어줌
        sub f, t0, t1 # f = t0 - t1
        \`\`\`
        
    
    ⇒ 한 줄의 C code 이지만 3줄의 assembly 언어가 되는 것을 볼 수 잇음
    

## Operands of Computer Hardware

- Register Operands
    - Arithmetic instructions use register operands: MIPS에서 수학적 연산은 register operand 이용
        
        *resgister: 어떠한 data를 담을 수 있는 가장 기본적인 단위 (CPU안에 존재하고 접근 훨씬 빠름)
        
    - MIPS has a 32 x 32-bit register file: 32-bit(word)를 담은 register가 32개
        - Use for frequently accessed data : 멀리가지 말고 자주 쓰는 거는 register에 저장
        - Numbered 0 to 31
        - 32-bit data called a “word”
    - Assembler names ($: register 의미)
        - $t0, $t1, ..., $t9 for temporary values
        - $s0, $s1, ..., $s7 for saved variables
    - **Design Principle 2: Smaller is faster**
    – (c.f.) Main memory: millions of locations
- Register Operand Example
    - **C code** \`f = (g+h) - (i+j);\`
        
        Assume f, g, h, i, and j are stored in $s0, $s1, $s2,$s3, and $s4, respectively
        
    - **Compiled MIPS code**
        
        \`\`\`bash
        add $t0, $s1, $s2 # temp t0 = g + h  // 연산결과를 임의로 t0라는 공간에 넣어줌
        add $t1, $s3, $s4 # temp t1 = i + j  // 연산결과를 임의로 t1라는 공간에 넣어줌
        sub $s0, $t0, $t1 # f = t0 - t1
        \`\`\`
        
- MIPS 32 Registers
    ![image2.png](./images/post6/2.png)
    
    - 각각의 용도에 맞게 register 써야함 (register 번호마다 이름, 쓰임새가 정해져 있음)
    
- MIPS Memory operands
    - Main memory used for composite data
        - Arrays, structures, dynamic data 이런 것들은 기본적으로 memory에 저장되어 있음
    - To apply arithmetic operations
        - **[Load]** values from memory into registers: 연산 위해 memory에서 register로 가져옴
        - **[Store]** result from register to memory: 연산 결과를 register에서 memory로 저장
    - Memory is byte addressed
        - 메모리는 바이트(8-bit)단위로 접근한다.[register는 word단위(32bit)
    - Words are aligned in memory
        - Address must be a multiple of 4
            ![image3.png](./images/post6/3.png)            
            
    - MIPS is Big Endian [접근방식이 주소의 msb를 이용]
        - Most-significant byte at least address of a word
        - (c.f.) Little Endian: least-significant byte at least address
        
- MIPS Memory Operand Example
    - C code \`g = h + A[8];\`
        
        g in $s1, h in $s2, base address of A in $s3
        
    - **Compiled MIPS code:**
        - 4 bytes per word (32 bits)
        - Index 8 requires offset of 32
        
        \`\`\`bash
        lw $t0, 32($s3) // load word(32bit) and store it in $t0
        \`\`\`
        
        \`32\` : offset , \`$s3\` : base register
        
    - C code  \`A[12] = h + A[8];\`
        
        h in $s2, base address of A in $s3
        
    - Compiled MIPS code:
        - 4 bytes per word (32 bits)
        - Index 8 requires offset of 32
        
        \`\`\`bash
        lw $t0, 32($s3) // load word(32bit) and store it in $t0
        add $t0, $s2, $t0 // 계산 후 다시 $t0에 넣음
        sw $t0, 48($s3) // store word: $t0는 register의 정보니까 다시 store해줘야함
        \`\`\`
        
    
- Register vs. Memory
    - Registers are faster to access than memory
        - 연산은 프로세서 안에서 이뤄지기 때문에 register 이용하는 게 더 빠름
    - Operating on memory data requires loads and stores
    - Compiler must use registers for variables as much as possible
        - register가 더 저렴한 비용으로 빠르게 연산하기 때문
        
- MemoryHierarchy
    ![image4.png](./images/post6/4.png)    
    
    - 아래로 내려갈 수록 많은 양의 data를 저장할 수 있지만, 느림
    - 보통 CPU=(registers, cache), DRAM=main memory
    
- MIPS Immediate Instructions
    - Constant data specified in an instruction
        
        **\`addi  $s3, $s3, 4\`**
        
    - No subtract immediate instruction (컴퓨터는 뺄샘을 할 수 없음 보통 2의 보수 이용해서 계산)
        
        **\`addi  $s2, $s2, -1\`**
        
    - **Design Principle 3: Make the common case fast**
- MIPS Constant
    - The constant zero
        - MIPS register 0($zero) is the constant 0 : cannot be overwritten
    - Useful for common operations
        - e.g., move between registers
            
            **\`add   $t2, $s1, $zero\`** : register 값 옮길 때 새로운 isa 만들 필요 없음
            
        
- **Summary of MIPS Design Principles**
    - **Simplicity favors regularity**
        - Fixed size instructions
        - Small number of instruction formats
        - Opcode always the first 6 bits
    - **Smaller is faster**
        - Limited instruction set
        - Limited number of registers in register file
        - Limited number of addressing modes
    - **Make the common case fast**
        - Arithmetic operands from the register file
        - Allow instructions to contain immediate operands

## Signed and Unsigned operand

…

## MIPS-32 ISA
![image5.png](./images/post6/5.png)

- MIPS는 규칙성을 위해 R, I, J format(모두 32 bits)으로 이루어짐

# 2. Representing Instructions

## Representing Instructions

assembly 언어를 어떻게 machine code로 변환하는가?

- Instructions are encoded in binary
    - Called machine code
    - instruction은 binary 형태의 machine code로 encoding되고 메모리에 저장됨
- MIPS instructions
    - Encoded as 32-bit instruction words
    - Small number of formats encoding operation code (opcode), register numbers, ...
    - Regularity!
- Register numbers
    - $t0 ~ $t7 are registers 8 ~ 15
    - $t8 – $t9 are registers 24 ~ 25
    - $s0 – $s7 are registers 16 ~ 23

- 하드웨어는 정해진 규칙에 따라서 해석하기만 하면 되기 때문에 포맷은 변하지 않음
- **MIPS R-format Instructions**
![image6.png](./images/post6/6.png)    
    
    - opcode 포함 6개의 field
        - **op: add, sub 연산에 주로 나타낼 때 사용**
        - rs , rt, rd: 연산을 위한 3개의 operand 필요하고 모두 register 사용
            - MIPS에서는 총 32개의 register(0~31) 사용 : 5 bits 필요  (2^5=32)
        - shamt: 비트를 몇칸 shift(옮길)지
        - funct: 6 bits로 opcode 나타내기 부족한 경우 사용 = opcode여분비트
- **MIPS R-format Example**
    - MIPS green sheet 참조해서 machine code(binary)로 변환 가능
        ![image7.png](./images/post6/7.png)    


- **MIPS I-format Instructions**
    ![image8.png](./images/post6/8.png)    
    
    - opcode 포함 4개의 field
        - **op: load, store, branch instruction에 주로 사용**
            - **memory, register에 접근**하는 operation ⇒ 16 bits가 필요한 이유
                - memory 접근: 주소 알아야함
                - register 접근: 번호 알아야함
        - rt: data를 memory로부터 읽어와서 register에 넣어줘야하는 데 이 때 register 결정
        - **하위 16 bits: 상수 또는 주소를 나타내는 데 사용**
        
- **Design Principle 4: Good design demands good compromises**
    - Different formats complicate decoding, but allow 32-bit instructions uniformly
    - Keep formats as similar as possible
    - 포맷의 통일화를 통해 계산이 조금 더 간단해짐
        - 앞 6 bit(opcode)를 통해 어떤 포맷인지 파악할 수 있음

- **MIPS J-format Instructions**
    ![image9.png](./images/post6/9.png)    
    
    - opcode 포함 4개의 field
        - **op: jump instruction에 주로 사용**
            - **memory, register에 접근**하는 operation ⇒ 16 bits가 필요한 이유
                - memory 접근: 주소 알아야함
                - register 접근: 번호 알아야함
        - rt: data를 memory로부터 읽어와서 register에 넣어줘야하는 데 이 때 register 결정
        - **하위 16 bits: 상수 또는 주소를 나타내는 데 사용**
        

## Stored Program Computers
![image10.png](./images/post6/10.png)

- Processor 형태의 연산 장치
- Memory 형태의 기억 장치
- 우리가 수행하는 모든 program은 memory에 존재
- 정확히 우리의 프로그램은 hard disk같은 저장 장치에서 memory로 올라오고, memory에서 processor로 올라와 연산 실행
- instruction과 data는 binary로 표현
- instruction과 data는 memory에 저장
- 메모리에 여러 프로그램이 구역을 나눠서 존재
- Binary compatibility allows compiled programs to work on different computers
- 즉, ISA만 같다면 컴파일된 파일을 다른 컴퓨터에서도 읽을 수 있음

## Logical Operations
![image11.png](./images/post6/11.png)

- Shift operations
    - Shift left logical
        - Shift left and fill with 0 bits
        - sll by i bits multiples by 2^i
        - shift 한 번 할 때마다 2씩 곱해짐
        - 0001 (=1) → 0010 (=2) → 0100 (=4)
    - Shift right logical
        - Shift right and fill with 0 bits
        - srl by i bits divides by 2i (unsigned only)
        - 0001 (=1) ← 0010 (=2) ← 0100 (=4)
        

- AND operations
    ![image12.png](./images/post6/12.png)    
    

- OR operations
    ![image13.png](./images/post6/13.png)    
    

- XOR operations
    ![image14.png](./images/post6/14.png)    
    

- NOT operations
    ![image15.png](./images/post6/15.png)    
    

## Instructions for Making Decisions

- **Conditional operations**
    - **\`beq\` branch equal**
        - \`beq  rs, rt, L1\` if (rs == rt) branch to instruction labeled L1;
    - **\`bne\` branch not equal**
        - \`bne  rs, rt, L1\` if (rs != rt)branch to instruction labeled L1;
    - **\`J\` jump**
        - \`J  L1\` unconditional jump to instruction labeled L1;
    - L1 은 컴퓨터 입장에서 보통 주소가 될 것 (어떤 메모리 주소로 이동해서 실행하라)

- **Compiling If Statements**
    - C code \`if(i==j) { f=g+h; } else { f = g-h; }\`
    - Compiled MIPS code
        - f, g, h, i, j = $s0, $s1, $s2, $s3, $s4
        
        \`\`\`bash
        bne $s3, $s4, ELSE
        add $s0, $s1, $s2
        j    EXIT
        ELSE: sub $s0, $s1, $s2 (ELSE는 주소값 label: 이 위치로 이동해라)
        EXIT:
        \`\`\`
        

- **Compiling Loop Statements**
    - C code \`while(save[i] ==k) i+=1;\`
    - Compiled MIPS code
        - i in $s3, k in $s5, address of save in $s6
        - Suppose the data type of the save array is word (4 byte)
        
        \`\`\`bash
        Loop: sll  $t1, $s3, 2     // i를 2만큼 left shift한 값을 t1에 넣음 (i를 4배)
              add  $t1, $t1, $s6   // save의 주소값 + 4*i = save[i]주소값 = t1
              lw   $t0, 0($t1)     // t1주소에 담긴 값을 불러오기:t0에 저장 (t0= save[i])
              bne  $t0, $s5, Exit  // i랑 k 값 비교 후 조건에 따라 exit
              addi $s3, $s3, 1     // i += 1
              j Loop ...           // 다시 loop 돌게 하기
        Exit: ...
        \`\`\`
        

- Basic blocks
    - A basic block is a sequence of instructions with
        - No embedded branches (except at end)
        - No branch targets (except at beginning)
    - 갈라짐 없이 쭉 코드가 실행되어 하나의 output이 나오는 block 단위
    - A compiler identifies basic blocks for optimization
    - An advanced processor can accelerate execution of basic blocks
    
    컴파일러는 처음에 코드를 쭉 스캔하면서 basic block 단위로 코드를 잘라내고 optimization을 함
    
- More conditional operations
    - Set result to 1 if a condition is true (otherwise, set to 0)
    - **\`slt  rd, rs, rt\`**  if (rs < rt) rd = 1, else rd = 0;
    - **\`slti  rt, rs, constant\`**  if (rs < constant) rt = 1, else rt = 0;
    - **\`slt\`** set less than
    
- Branch Instruction Design
    - blt, bge 안쓰는 이유는 **Hardware에서 <, ≥ 같은 연산은 =, ≠ 보다 훨씬 느리기 때문**
    - **beq** and **bne** are the common case

- Signed vs. Unsigned
    - Signed comparison: \`slt\`, \`slti\`
    - Unsigned comparison: \`sltu\`, \`sltui\`
    - 어떤 instruction 쓰느냐에 따라서 표현할 수 있는 값의 범위가 다름
    - 만일, 엄청나게 큰 양수 표현하고 싶을 시, unsigned 중에서 사용 가능

`;


const Post8 = {
  id: 8,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2023',
  tags: ['Computer Architecuture', 'ISA', 'Computer Science', 'MIPS'],
  excerpt: '이 글은 컴퓨터 구조 수업에서 다루는 MIPS ISA에 대한 개요와 함께, 명령어 포맷(R/I/J), 레지스터 구조, 메모리 접근 방식 등을 상세히 설명하고, C 코드가 MIPS 어셈블리 코드로 변환되는 과정을 예제로 살펴본다. 또한 조건문과 반복문을 MIPS로 구현하는 방식과 Logical Operation, Branch Instruction 설계 원칙 등을 소개한다.',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post8;

