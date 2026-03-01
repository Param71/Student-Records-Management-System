#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int roll; char name[64]; float gpa;
    int h; struct Node *l, *r;
} Node;

#define H(x) ((x)?(x)->h:0)
#define MAX(a,b) ((a)>(b)?(a):(b))
static void up(Node* n){ if(n) n->h = 1 + MAX(H(n->l), H(n->r)); }

static Node* newN(int roll, const char* name, float gpa){
    Node* n = (Node*)malloc(sizeof(Node));
    if(!n){ puts("Memory error"); exit(1); }
    n->roll = roll; strncpy(n->name,name,63); n->name[63]=0;
    n->gpa = gpa; n->l = n->r = NULL; n->h = 1; return n;
}

static Node* rotR(Node* y){ Node* x=y->l; Node* t=x->r; x->r=y; y->l=t; up(y); up(x); return x; }
static Node* rotL(Node* x){ Node* y=x->r; Node* t=y->l; y->l=x; x->r=t; up(x); up(y); return y; }
static int bf(Node* n){ return H(n->l)-H(n->r); }

static Node* insert(Node* r,int roll,const char* name,float gpa){
    if(!r) return newN(roll,name,gpa);
    if(roll<r->roll) r->l=insert(r->l,roll,name,gpa);
    else if(roll>r->roll) r->r=insert(r->r,roll,name,gpa);
    else { strncpy(r->name,name,63); r->name[63]=0; r->gpa=gpa; return r; }
    up(r); int b=bf(r);
    if(b>1 && roll<r->l->roll) return rotR(r);                        // LL
    if(b<-1 && roll>r->r->roll) return rotL(r);                       // RR
    if(b>1 && roll>r->l->roll){ r->l=rotL(r->l); return rotR(r);}     // LR
    if(b<-1 && roll<r->r->roll){ r->r=rotR(r->r); return rotL(r);}    // RL
    return r;
}

static Node* minN(Node* r){ while(r && r->l) r=r->l; return r; }

static Node* avl_delete(Node* r,int roll){
    if(!r) return NULL;
    if(roll<r->roll) r->l=avl_delete(r->l,roll);
    else if(roll>r->roll) r->r=avl_delete(r->r,roll);
    else{
        if(!r->l||!r->r){ Node* t=r->l?r->l:r->r; free(r); return t; }
        Node* s=minN(r->r);
        r->roll=s->roll; strncpy(r->name,s->name,63); r->name[63]=0; r->gpa=s->gpa;
        r->r=avl_delete(r->r,s->roll);
    }
    up(r); int b=bf(r);
    if(b>1 && bf(r->l)>=0) return rotR(r);
    if(b>1 && bf(r->l)<0){ r->l=rotL(r->l); return rotR(r); }
    if(b<-1 && bf(r->r)<=0) return rotL(r);
    if(b<-1 && bf(r->r)>0){ r->r=rotR(r->r); return rotL(r); }
    return r;
}

static Node* search(Node* r,int roll){
    while(r && r->roll!=roll) r = (roll<r->roll)? r->l : r->r;
    return r;
}

static void inorder(Node* r){
    if(!r) return; inorder(r->l);
    printf("Roll=%d | Name=%-20s | GPA=%.2f\n", r->roll, r->name, r->gpa);
    inorder(r->r);
}

static void level_order(Node* r){
    if(!r) return;
    Node* q[2048]; int f=0,t=0; q[t++]=r;
    while(f<t){
        Node* n=q[f++];
        printf("Roll=%d | Name=%-20s | GPA=%.2f\n", n->roll, n->name, n->gpa);
        if(n->l) q[t++]=n->l;
        if(n->r) q[t++]=n->r;
    }
}

static void stats(Node* r,int* cnt,float* sum,int dist[4]){
    if(!r) return; (*cnt)++; *sum+=r->gpa;
    if(r->gpa>=9.0) dist[0]++; else if(r->gpa>=8.0) dist[1]++; else if(r->gpa>=7.0) dist[2]++; else dist[3]++;
    stats(r->l,cnt,sum,dist); stats(r->r,cnt,sum,dist);
}

static void range_gpa(Node* r,float lo,float hi){
    if(!r) return;
    if(r->gpa>=lo && r->gpa<=hi) printf("Roll=%d | Name=%-20s | GPA=%.2f\n", r->roll, r->name, r->gpa);
    range_gpa(r->l,lo,hi); range_gpa(r->r,lo,hi);
}

static void name_search(Node* r,const char* p){
    if(!r) return;
    if(strstr(r->name,p)) printf("Roll=%d | Name=%-20s | GPA=%.2f\n", r->roll, r->name, r->gpa);
    name_search(r->l,p); name_search(r->r,p);
}

static void save(Node* r, FILE* f){
    if(!r) return; fprintf(f,"%d %s %.2f\n", r->roll, r->name, r->gpa);
    save(r->l,f); save(r->r,f);
}

static Node* load(Node* r, FILE* f){
    int roll; char name[64]; float gpa;
    while(fscanf(f,"%d %63s %f",&roll,name,&gpa)==3) r=insert(r,roll,name,gpa);
    return r;
}

static void free_all(Node* r){ if(!r) return; free_all(r->l); free_all(r->r); free(r); }

static void header(void){
    printf("\n===============================================================\n");
    printf("\n");
    printf("              SAKEC ECS-1 STUDENT RECORDS MANAGER \n");
    printf("              DSA MicroProject By Rollno.:65,66,68 \n");
    printf("              Topic: AVL Tree \n");
    printf("\n");
    printf("===============================================================\n");
}

static void menu(void){
    printf("\n****** MAIN MENU ******\n");
    printf("\n  1. Add/Update Student     2. Delete Student\n");
    printf("  3. Search Student         4. View Statistics\n");
    printf("  5. Sorted View (Inorder)  6. Level Order View\n");
    printf("  7. GPA Range Filter       8. Name Search\n");
    printf("  9. Save to File           10. Load from File\n");
    printf("  11. Clear All Data        12. Export Data\n");
    printf("  0. Exit Program\n");
    printf("\nEnter your choice number here: ");
}

static void clear_in(void){ int c; while((c=getchar())!='\n' && c!=EOF); }

int main(void){
    Node* root=NULL;
    root=insert(root,65,"Smit Chauhan",8.1f);
    root=insert(root,66,"Param Mehta",8.5f);
    root=insert(root,68,"Atharva Yadav",9.0f);
 

    header(); puts("\n********* Welcome!! *********\n");

    for(;;){
        int ch; menu();
        if(scanf("%d",&ch)!=1){ clear_in(); continue; }
        clear_in();
        if(ch==0){ puts("\nWe Thank you for your interest in this project! \n"); free_all(root); break; }
        else if(ch==1){
            int roll; char name[64]; float gpa;
            printf("Enter Roll Number, Name, and GPA: ");
            if(scanf("%d %63s %f",&roll,name,&gpa)==3){ root=insert(root,roll,name,gpa);
                printf("SUCCESS: Student %s (Roll: %d) added/updated successfully!\n", name, roll);
            } else { puts("ERROR: Invalid input format!"); clear_in(); }
        } else if(ch==2){
            int roll; printf("Enter Roll Number to delete: ");
            if(scanf("%d",&roll)==1){
                if(search(root,roll)){ root=avl_delete(root,roll);
                    printf("SUCCESS: Student with Roll %d deleted successfully!\n", roll);
                } else puts("ERROR: Student not found!");
            } else { puts("ERROR: Invalid input!"); clear_in(); }
        } else if(ch==3){
            int roll; printf("Enter Roll Number to search: ");
            if(scanf("%d",&roll)==1){
                Node* p=search(root,roll);
                if(p) printf("FOUND: Roll=%d | Name=%-20s | GPA=%.2f\n", p->roll,p->name,p->gpa);
                else puts("ERROR: Student not found!");
            } else { puts("ERROR: Invalid input!"); clear_in(); }
        } else if(ch==4){
            int cnt=0, dist[4]={0}; float sum=0;
            stats(root,&cnt,&sum,dist);
            printf("\nSTATISTICS:\n");
            printf("  Total Students: %d\n", cnt);
            printf("  Average GPA: %.2f\n", cnt? sum/cnt : 0.0f);
            printf("  Grade Distribution:\n");
            printf("    A+ (9.0+): %d students\n", dist[0]);
            printf("    A  (8.0+): %d students\n", dist[1]);
            printf("    B  (7.0+): %d students\n", dist[2]);
            printf("    C  (<7.0): %d students\n", dist[3]);
        } else if(ch==5){
            puts("\nSORTED VIEW (Inorder):"); inorder(root);
        } else if(ch==6){
            puts("\nLEVEL ORDER VIEW:"); level_order(root);
        } else if(ch==7){
            float lo,hi; printf("Enter GPA range (min max): ");
            if(scanf("%f %f",&lo,&hi)==2){ printf("\nStudents in GPA range %.1f - %.1f:\n",lo,hi); range_gpa(root,lo,hi); }
            else { puts("ERROR: Invalid input!"); clear_in(); }
        } else if(ch==8){
            char pat[64]; printf("Enter name pattern to search: ");
            if(scanf("%63s",pat)==1){ printf("\nStudents matching '%s':\n",pat); name_search(root,pat); }
            else { puts("ERROR: Invalid input!"); clear_in(); }
        } else if(ch==9){
            FILE* f=fopen("students.txt","w");
            if(f){ save(root,f); fclose(f); puts("SUCCESS: Data saved to students.txt"); }
            else puts("ERROR: Failed to save file!");
        } else if(ch==10){
            FILE* f=fopen("students.txt","r");
            if(f){ free_all(root); root=NULL; root=load(root,f); fclose(f); puts("SUCCESS: Data loaded from students.txt"); }
            else puts("ERROR: Failed to load file!");
        } else if(ch==11){
            free_all(root); root=NULL; puts("SUCCESS: All data cleared!");
        } else if(ch==12){
            puts("\nEXPORTING DATA:"); inorder(root);
        } else puts("ERROR: Invalid choice! Please try again.");
    }
    return 0;
}
